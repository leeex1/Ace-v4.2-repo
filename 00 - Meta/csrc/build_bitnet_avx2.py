"""Build quillan BitNet AVX2 extension.
Requires: MSVC cl on PATH (VsDevCmd), torch, pybind11, ninja.
Run from an MSVC x64 prompt with DISTUTILS_USE_SDK=1:
    cd C:\\02_QUILLAN\\00 - Meta\\csrc
    python build_bitnet_avx2.py build_ext --inplace
Then copy the .pyd next to it into 00 - Meta/oni/ so the model loads it.
Measured 2026-09-06: quant kernel 4.42x vs torch JIT, parity 1.4e-06.
"""
from setuptools import setup
from torch.utils.cpp_extension import CppExtension, BuildExtension

setup(
    name="quillan_bitnet_cpu",
    ext_modules=[
        CppExtension(
            "quillan_bitnet_cpu",
            sources=[r"C:\02_QUILLAN\00 - Meta\csrc\bitnet_cpu_avx2.cpp"],
            extra_compile_args=["/O2", "/arch:AVX2", "/openmp"],
        )
    ],
    cmdclass={"build_ext": BuildExtension},
)
