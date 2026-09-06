@echo off
REM ==============================================================================
REM  QUILLAN-RONIN v5.4.0 ONI — LOCAL 500M TRAINING LAUNCHER (PASCAL sm_61)
REM ==============================================================================
echo [INFO] Initializing Quillan-Ronin 500M Training Run on Local Pascal GPU...

REM 1. Pascal Hardware Environment Tuning
set CUDA_VISIBLE_DEVICES=0
set TORCH_CUDA_ARCH_LIST=6.1
set PYTHONUNBUFFERED=1

REM 2. Memory & Thread Allocations
set OMP_NUM_THREADS=4
set MKL_NUM_THREADS=4

REM 3. Configuration Parameters
REM n_layer=18 yields ~492M parameters
REM --batch-size 1 + --grad-accum 16 = effective batch size 16
REM --grad-checkpoint is ESSENTIAL to keep activation memory under 1GB on Pascal
set N_LAYER=18
set SEQ_LEN=512
set BATCH_SIZE=1
set GRAD_ACCUM=16
set LR=3e-4
set WARMUP=200
set STEPS=20000

echo [CONFIG] Model: ~500M (n_layer=%N_LAYER%, seq_len=%SEQ_LEN%)
echo [CONFIG] Batch Size: %BATCH_SIZE% (Accum: %GRAD_ACCUM% -^> Effective Batch: 16)
echo [CONFIG] Gradient Checkpointing: ENABLED (Saves ~85%% activation VRAM)
echo.

python oni\train_oni.py ^
    --n-layer %N_LAYER% ^
    --seq-len %SEQ_LEN% ^
    --batch-size %BATCH_SIZE% ^
    --grad-accum %GRAD_ACCUM% ^
    --lr %LR% ^
    --warmup %WARMUP% ^
    --steps %STEPS% ^
    --grad-checkpoint ^
    --device cuda ^
    --resume

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Training run exited with code %ERRORLEVEL%
    pause
)
