const gameProcess = (() => {
    'use strict';
    /**
     * 2C = Two of Clubs
     * 2D = Two of Diamonds
     * 2H = Two of Hearts
     * 2S = Two of Spades
     */

    let deck         = [];
    const types      = ['C','D','H','S'];
    const specials   = ['A','J','Q','K'];
    let winValue = 21

    // Referencias del HTML
    const btnAsk  = document.querySelector('#btnAsk'),
          btnStop = document.querySelector('#btnStop'),
          btnNew  = document.querySelector('#btnNew');
    btnAsk.setAttribute("disabled", true)
    btnStop.setAttribute("disabled", true)
    btnNew.setAttribute("disabled", true);

    const divPlayerCards   = document.querySelector('#player');
    const divComputerCards = document.querySelector('#computer');

    const score = document.querySelectorAll('small');

    const init = () => {
        createDeck()
        document.querySelector('#btnStart').setAttribute("disabled", true);
        btnNew.removeAttribute('disabled');
        btnAsk.removeAttribute('disabled');
    }

    const createDeck = () => {

        for( let i = 2; i <= 10; i++ ) {
            for( let type of types ) {
                deck.push( i + type);
            }
        }

        for( let type of types ) {
            for( let sp of specials ) {
                deck.push( sp + type);
            }
        }
        deck = _.shuffle( deck ); //de la librería de undescore para mezclar los elementos del array
        return deck;
    }

    const askCard = () => {

        if ( deck.length === 0 ) {
            throw 'there are not cards';
        }
        const card = deck.pop();
        return card;
    }

    const valueCard = ( card ) => {

        const value = card.substring(0, card.length - 1);
        return ( isNaN( value ) ) ? 
                ( value === 'A' ) ? 11 : 10
                : value * 1;
    }

    btnAsk.addEventListener('click', () => {
        generateNewCard(score[0], divPlayerCards)
        btnStop.removeAttribute("disabled");
        if(Number(score[0].textContent) >= winValue) {
            btnAsk.setAttribute('disabled', true)
            btnStop.setAttribute('disabled', true)
            computerGame()
        }

        
        /*
            const imgCarta = document.createElement('img');
            imgCarta.src = `assets/cartas/${ carta }.png`; //3H, JD
            imgCarta.classList.add('carta');
            divCartasComputadora.append( imgCarta );
        */
    })

    btnStop.addEventListener('click', () => {
        btnAsk.setAttribute('disabled', true)
        btnStop.setAttribute('disabled', true)
        computerGame()
    })

    btnNew.addEventListener("click", () => {
        btnAsk.removeAttribute('disabled')
        btnStop.removeAttribute('disabled')
        deck         = []
        createDeck();
        divPlayerCards.innerHTML=null
        divComputerCards.innerHTML=null
        document.querySelector(".result").innerHTML=null
        score.forEach(eachScore => eachScore.textContent = 0)
        winValue = 21
    })

    function computerGame() {
        generateNewCard(score[1], divComputerCards)
        const computerScore = Number(score[1].textContent);
        if(computerScore >= winValue){
            getResult();
        } else if((winValue - computerScore) < 6){
            const randVal = _.random(1, 2)
            if(randVal === 1 && (winValue - computerScore) > 2) {
                computerAction()
            } else {
                getResult();
            }
        } else {
            computerAction()
        }
    }

    function generateNewCard(scorePy, element) {
        let card = askCard(),
            value = valueCard(card),
            totalScore = Number(scorePy.textContent) + Number(value);
        element.insertAdjacentHTML("beforeend",`<img class='card' src='assets/cards/${ card }.png' />`);
        scorePy.textContent = totalScore;
    }

    function computerAction() {
        setTimeout(() => {
            computerGame()
        }, 1000)
    }

    function getResult() {
        const playerScore = Math.abs(Number(score[0].textContent) - winValue)
        const compScore = Math.abs(Number(score[1].textContent) - winValue)
        if(playerScore < compScore) {
            document.querySelector(".result").insertAdjacentHTML("beforeend",`<h1>YOU WIN!!</h1>`);
        } else {
            if(playerScore === compScore) {
                document.querySelector(".result").insertAdjacentHTML("beforeend",`<h1>TIE</h1>`);
                btnAsk.removeAttribute('disabled')
                btnStop.removeAttribute('disabled')
                winValue = winValue + 21
            } else {
                document.querySelector(".result").insertAdjacentHTML("beforeend",`<h1>YOU LOSE!!</h1>`);
            }        
        }
    }

    return {
        nuevoJuego: init
    };
})()