# One time Setup
### On Windows:-
    1. Download/Clone this repo.
    2. Install chocolatey if not installed
        a. Open powershellcin administrator mode.
        b. Type following command –
        c.  Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    3. Install nodejs using chocolatey:
        a. C:\> choco install nodejs.install
    4. Close Command prompt.

### On Mac:-
    1. Download/Clone this repo.
    2. execute following commands in terminal :-
        a. ruby -e “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)”
        b. brew install node


# Execution
### On Windows:-
    1. Open Command prompt and go to directory where code has been downloaded
    2. Execute following command - 
    3. npm run-script win
### On Mac:-
    1. Open Command prompt and go to directory where code has been downloaded
    2. Execute following command
    3. npm run-script mac

