(() => {
    'use strict';
    let deck = [],
        tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

    const puntosHTML = document.querySelectorAll('small'),
        divCartasJugadores = document.querySelectorAll('.divCartas');

    const iniciarJuego = (numJugadores = 1) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        puntosJugadores.push(0);
        puntosHTML.forEach((elem) => (elem.innerText = 0));
        divCartasJugadores.forEach((elem) => (elem.innerHTML = ''));
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    };

    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);
    };

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    };

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return isNaN(valor) ? (valor === 'A' ? 11 : 10) : valor * 1;
    };

    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    };

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.classList.add('carta');
        imgCarta.src = `assets/cartas/${carta}.png`;
        divCartasJugadores[turno].append(imgCarta);
    };

    const turnoComputadora = async (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(
                carta,
                puntosJugadores.length - 1
            );
            crearCarta(carta, divCartasJugadores.length - 1);
            if (puntosMinimos > 21) {
                break;
            }
        } while (puntosComputadora < puntosMinimos && puntosComputadora <= 21);

        setTimeout(() => {
            determinarGanador();
        }, 200);
    };

    const determinarGanador = () => {
        const [puntosJugador, puntosComputadora] = puntosJugadores;
        if (
            (puntosJugador > 21 && puntosComputadora > 21) ||
            puntosJugador === puntosComputadora
        ) {
            alert('Empate');
        } else if (puntosJugador > 21) {
            alert('Perdiste');
        } else if (puntosComputadora > 21) {
            alert('Ganaste');
        } else if (puntosJugador > puntosComputadora) {
            alert('Ganaste');
        } else {
            alert('Perdiste');
        }
    };

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('21, genial!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        iniciarJuego();
    });
})();
