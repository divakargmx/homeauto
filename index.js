<!DOCTYPE html>
<html>
<head>
  <title>Live Toggle Switches</title>
  <style>
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <h1>Live Toggle Switches</h1>
  <div id="switchContainer"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/mqtt/4.2.7/mqtt.min.js"></script>
  <script>
    // Define the MQTT broker URL
    const brokerUrl = 'mqtt://broker.emqx.io';

    // Define the topic for the switches
    const switchTopic = 'Wakar';

    // Create an MQTT client
    const client = mqtt.connect(brokerUrl);

    // Handle the MQTT connection event
    client.on('connect', () => {
      console.log('Connected to MQTT broker');

      // Subscribe to the switches topic
      client.subscribe(switchTopic);
    });

    // Handle incoming MQTT messages
    client.on('message', (topic, message) => {
      // Convert the message to a JSON object
      const data = JSON.parse(message.toString()).data;

      // Check if the message is for the switches topic
      if (topic === switchTopic) {
        console.log('Switches:', data);

        // Update the UI based on the switches state
        const switchContainer = document.getElementById('switchContainer');
        switchContainer.innerHTML = '';

        // Loop through the switches and create toggle switches dynamically
        for (const switchId in data) {
          if (data.hasOwnProperty(switchId)) {
            const switchState = data[switchId].val;

            const switchElement = document.createElement('label');
            switchElement.className = 'switch';

            const inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.id = switchId;
            inputElement.checked = switchState === 1;

            const sliderElement = document.createElement('span');
            sliderElement.className = 'slider round';

            switchElement.appendChild(inputElement);
            switchElement.appendChild(sliderElement);

            switchContainer.appendChild(switchElement);
          }
        }
      }
    });
  </script>
</body>
</html>
