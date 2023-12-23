document.addEventListener('DOMContentLoaded', function () {
    const botonHablar = document.getElementById('hablar');
    const botonPausar = document.getElementById('pausar');
    const botonReanudar = document.getElementById('reanudar');
    const botonGrabar = document.getElementById('grabar');
    const texto = document.getElementById('texto');
    let utterance;
    let recorder;
    let audioChunks = [];

    function seleccionarVoz() {
        const vozElegida = speechSynthesis.getVoices().find(voice => voice.name === "Microsoft Pablo - Spanish (Spain)");
        return vozElegida || speechSynthesis.getVoices()[0];
    }

    botonHablar.addEventListener('click', () => {
        const contenidoTexto = texto.value.trim();
        if (contenidoTexto) {
            utterance = new SpeechSynthesisUtterance(contenidoTexto);
            utterance.voice = seleccionarVoz();
            speechSynthesis.speak(utterance);
            botonHablar.disabled = true;
            botonPausar.disabled = false;
            botonReanudar.disabled = false;
        }
    });

    botonPausar.addEventListener('click', () => {
        if (utterance) {
            speechSynthesis.pause();
            botonHablar.disabled = false;
            botonPausar.disabled = true;
            botonReanudar.disabled = false;
        }
    });

    botonReanudar.addEventListener('click', () => {
        if (utterance) {
            speechSynthesis.resume();
            botonHablar.disabled = true;
            botonPausar.disabled = false;
            botonReanudar.disabled = true;
        }
    });

    botonGrabar.addEventListener('click', () => {
        const contenidoTexto = texto.value.trim();
        if (contenidoTexto) {
            audioChunks = [];
            recorder = Recorder({
                onProcess: function (buffers, newBuffer) {
                    audioChunks.push(newBuffer);
                }
            });

            utterance = new SpeechSynthesisUtterance(contenidoTexto);
            utterance.voice = seleccionarVoz();

            recorder.open(() => {
                recorder.start();
                speechSynthesis.speak(utterance);
            });

            utterance.onend = () => {
                recorder.stop();
                recorder.close();
                const blob = recorder.getBlob();
                const url = URL.createObjectURL(blob);
                const enlaceDescarga = document.createElement('a');
                enlaceDescarga.href = url;
                enlaceDescarga.download = 'audio.wav';
                enlaceDescarga.click();
            };
        }
    });
});
botonGrabar.addEventListener('click', () => {
    const contenidoTexto = texto.value.trim();
    if (contenidoTexto) {
        audioChunks = [];
        recorder = Recorder({
            onProcess: function (buffers, newBuffer) {
                audioChunks.push(newBuffer);
            }
        });

        utterance = new SpeechSynthesisUtterance(contenidoTexto);
        utterance.voice = seleccionarVoz();

        recorder.open(() => {
            recorder.start();
            speechSynthesis.speak(utterance);
        });

        utterance.onend = () => {
            recorder.stop();
            recorder.close();
            const blob = recorder.getBlob();
            guardarAudio(blob);
        };
    }
});

function guardarAudio(blob) {
    const url = URL.createObjectURL(blob);
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = url;
    enlaceDescarga.download = 'audio.wav';
    enlaceDescarga.click();
}