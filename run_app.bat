@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if %errorlevel%==0 (
  set "PYTHON_CMD=python"
) else (
  where py >nul 2>nul
  if %errorlevel%==0 (
    set "PYTHON_CMD=py"
  ) else (
    set "PYTHON_CMD=C:\Users\Turgud\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
  )
)

"%PYTHON_CMD%" -m pip install -r requirements.txt
"%PYTHON_CMD%" run_backend.py
