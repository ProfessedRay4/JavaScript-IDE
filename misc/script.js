require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], function () {
    // create instance
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: '// Write code here...\n\nfunction whoIs(name) {\n    console.log(`It is ${name}`);\n}\n\nwhoIs("me");',
        language: 'javascript',
        theme: 'vs-dark',
        overviewRulerLanes: 0,
        scrollbar: {
        vertical:"hidden",
        horizontal: "hidden",
        handleMouseWheel:false,
        },
        wordWrap: 'on',
        minimap: {
            enabled: false,
        }
    });

    // override console output
    const outputContainer = document.getElementById('output');
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
    };

    // redirect console methods
    function redirectConsole(method, color) {

        console[method] = function(...args) {
            // append output 
            args.forEach(arg => {
                const message = document.createElement('div');
                message.style.color = color;
                message.textContent = `[${method.toUpperCase()}] ${arg} [${timeStamp()}]`; // type of redirect
                outputContainer.appendChild(message); // actually writes to container
            });
            originalConsole[method].apply(console, args);
        }
    }

    // redirect console methods
    redirectConsole('log', '#00ff00'); // Green logs
    redirectConsole('error', '#ff5555'); // Red errors
    redirectConsole('warn', '#ffaa00'); // Orange warnings
    redirectConsole('info', '#55aaff'); // Blue info

    // Run button 
    document.getElementById('run-button').addEventListener('click', () => {
        const code = editor.getValue();

        // clear console
        outputContainer.innerHTML = '';

        try {
            // Execute the code
            const result = eval(code);

            // If code returns a value, display it as a log
            if (result !== undefined) {
                console.log(result);
            }
        } catch (error) {
            // Display any errors
            console.error(error);
        }
    });
});

function timeStamp() {
      var now = new Date();

      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    
      var suffix = ( time[0] < 12 ) ? "AM" : "PM";
    
      time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    
    // If hour is 0, set it to 12
      time[0] = time[0] || 12;
    
    // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i];
        }
      }
      return time.join(":") + " " + suffix;
    }

console.log(timeStamp());