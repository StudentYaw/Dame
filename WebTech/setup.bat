:: Download python if not already downloaded
Powershell.exe -File Install-Python.ps1
:: Download pip if not already downloaded
pip install --upgrade pip 
:: Download and install requirements in requirements.txt
echo Installing requirements...
pip install -r requirements.txt
:: Open browser in http://127.0.0.1:5000
start http://127.0.0.1:5000
:: Run the python script checkers.py
echo Running checkers...
python checkers.py
