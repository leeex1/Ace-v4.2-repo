"""Build quillan BitNet AVX2 extension into this temp dir (repo untouched)."""
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
