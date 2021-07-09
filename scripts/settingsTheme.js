// By Joshua Koh

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        try{
            toggleSwitch.checked = false;
        } catch {}
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'default');
        localStorage.setItem('theme', 'light');
    }
    else {document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
    }    
}
try{
    toggleSwitch.addEventListener('change', switchTheme, false);
} catch {}