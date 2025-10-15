/**
 * Simulador Realista de Histerese — Umidificador IoT (ESP32)
 * 
 * Comportamento físico aproximado:
 * - Umidade sobe lentamente quando o umidificador está LIGADO (~0,3%/s simulado)
 * - Umidade desce MUITO lentamente quando DESLIGADO (~0,1%/s simulado)
 *   (simulando decaimento natural em quarto fechado)
 */

document.addEventListener('DOMContentLoaded', function () {
  // Elementos do DOM
  const slider = document.getElementById('humiditySlider');
  const humidityValue = document.getElementById('humidityValue');
  const humidityFill = document.getElementById('humidityFill');
  const statusText = document.getElementById('statusText');
  const statusBox = document.getElementById('statusBox');

  // Estado do sistema
  let humidifierOn = false;
  let currentHumidity = 45; // valor inicial (%)
  let isManualControl = false;
  let lastUpdate = performance.now();

  // Taxas realistas (escaladas para demonstração)
  const HUMIDITY_RISE_RATE = 0.3;   // % por segundo (quando ligado)
  const HUMIDITY_FALL_RATE = 0.1;   // % por segundo (quando desligado)

  // Atualiza a interface
  function updateDisplay(humidity) {
    const rounded = Math.round(humidity);
    humidityValue.textContent = `${rounded}%`;
    humidityFill.style.width = `${rounded}%`;
    
    statusText.textContent = humidifierOn ? 'Ligado' : 'Desligado';
    statusBox.style.borderColor = humidifierOn ? '#16a34a' : '#dc2626';
    statusBox.style.color = humidifierOn ? '#16a34a' : '#dc2626';
  }

  // Loop de simulação contínua
  function simulate(timestamp) {
    if (!isManualControl) {
      const deltaTime = (timestamp - lastUpdate) / 1000; // em segundos
      lastUpdate = timestamp;

      // Aplica lógica de controle (histerese)
      if (currentHumidity < 30) {
        humidifierOn = true;
      } else if (currentHumidity > 60) {
        humidifierOn = false;
      }

      // Atualiza umidade com base no estado
      if (humidifierOn) {
        currentHumidity += HUMIDITY_RISE_RATE * deltaTime;
      } else {
        currentHumidity -= HUMIDITY_FALL_RATE * deltaTime;
      }

      // Limita a faixa realista
      currentHumidity = Math.max(10, Math.min(90, currentHumidity));

      // Atualiza slider e interface
      slider.value = Math.round(currentHumidity);
      updateDisplay(currentHumidity);
    }

    requestAnimationFrame(simulate);
  }

  // Controle manual
  slider.addEventListener('input', function () {
    isManualControl = true;
    currentHumidity = parseFloat(slider.value);
    updateDisplay(currentHumidity);
  });

  slider.addEventListener('change', function () {
    isManualControl = false;
    lastUpdate = performance.now();
  });

  // Inicialização
  updateDisplay(currentHumidity);
  lastUpdate = performance.now();
  requestAnimationFrame(simulate);
});