@echo off
REM One-click preview for AfterTimeWebPage
REM If Node (npx) is installed this will run live-server and open aftertimefault.html
REM Otherwise it will try Python's http.server and open the page in the default browser.

nwhere npx >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Running live-server via npx...
  npx live-server --open=aftertimefault.html --port=5500
) else (
  echo npx not found. Falling back to Python http.server...
  start "" http://localhost:5500/aftertimefault.html
  python -m http.server 5500
)

