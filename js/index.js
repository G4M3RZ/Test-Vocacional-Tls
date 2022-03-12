//#region ----------------------HTML-----------------------

    //#region ----Basic

        //Numeric Input Field
        const numericInputs = document.getElementsByClassName('numeric');
        var invalidInputs = ["-", "+", "e", "."];

        const InvalidInput = (e) => { if(invalidInputs.includes(e.key)) e.preventDefault(); };
        numericInputs.forEach(i => i.addEventListener("keydown", InvalidInput));
        
        //Email Validation
        const ValidEmail = (mail) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

    //#endregion

    //#region ----Fade Scenes----

        //#region Main Scenes
        const loginView = document.getElementById('login');
        const tutorialView = document.getElementById('tutorial');
        const surveyView = document.getElementById('survey');
        //#endregion
        //#region Sub Scenes
        //Login
        const loginContainer = document.getElementById('login-container');
        const loginLoad = document.getElementById('loading');

        //Questionary
        const questionary = document.getElementById('questionary');
        const game = document.getElementById('minigame');
        const result = document.getElementById('result');
        //#endregion

        function ChangeViewState(from, to)
        {
            from?.classList.replace('enable', 'disable');
            to?.classList.replace('disable', 'enable');
        }

    //#endregion

    //#region ----Category----

        const textContainer = document.getElementById('text-container');
        const username = document.getElementById('username');
        const list = document.querySelectorAll('.list');

        function SetUsername(string)
        {
            username.innerHTML = string.toString();
            textFit(textContainer);
        }
        function SelectVocation()
        {
            const max = Math.max.apply(null, json_session.amount);
            const index = json_session.amount.indexOf(max);

            for(i = 0; i < list.length; i++)
            {
                if(i != index) list[i].classList.remove('active');
                else list[i].classList.add('active');
            }
        }

    //#endregion

    //#region ----Progress Bar----

        //#region Elements
        const percent = document.getElementById("amount");
        const levels = document.getElementsByClassName("progress");
        const bar = document.getElementById("fill-amount");
        //#endregion

        function SetProgressBar(validate)
        {
            const value = Math.round(Math.min(json_session.progress, 100));
            percent.innerHTML = bar.style.width = value + "%";

            const reach = 100 / (levels.length - 1);
            const succed = Math.floor(value / reach);

            for(let i = succed; i >= 1; i--)
            {
                if(levels[i].classList.contains('uncomplete'))
                {
                    levels[i].classList.replace('uncomplete', 'complete');
                    if(validate) json_session.playing = true;
                }
            }
        }

    //#endregion

    //#region ----Minigame----

        //#region Button
        const shootButton = document.getElementById('shoot'); 
        shootButton.addEventListener('click', () => Shoot());
        //#endregion

        function SetMiniGame()
        {
            if(!json_session.playing) return;

            const start = json_session.current;
            const end = start + gameQuestions;
            let questions = [];

            for(let j = start; j < end; j++) questions.push(json_session.questions[j]);

            ResetGame(questions);
            ChangeViewState(questionary, game);
        }

    //#endregion

    //#region ----Question Box----

        //#region Elements
        const qBox = document.getElementById("question-box");
        const box1 = qBox.firstElementChild;
        const box2 = qBox.lastElementChild;
        //#endregion

        let currentBox = 0;

        SetBoxStyle(box2, 0, 0, 0);
        async function Swipe(dir, opacity, time)
        {
            if(json_session.progress >= 100 || json_session.questions.length === 0 || json_session.playing) return;

            var value = dir > 0;
            //Category Base on Id
            if(value) AddCategory(json_session.questions[json_session.current].subcategory.link.area.id);
            AddAnswer(json_session.questions[json_session.current].id, value ? 1 : 0);

            //Add progress amount
            json_session.current++;
            json_session.progress += 100 / json_session.total;
            SetProgressBar(true);
            SetMiniGame();

            //Swipe effect
            let element1 = currentBox == 0 ? box1 : box2;
            let element2 = currentBox == 0 ? box2 : box1;
            SetBoxStyle(element1, dir, opacity, time);
            SetBoxStyle(element2, 0, 0, 0);

            //Await to complete minigame
            await until(() => json_session.playing == false);

            //Swipe Delay
            if(json_session.progress >= 100) { SendSurvey(); return; };
            await delay(time * 100);

            //Save Json Progress
            SaveProgress();

            currentBox = currentBox == 0 ? 1 : 0;
            SetBoxText(element2, json_session.questions[json_session.current].title);
            SetBoxStyle(element2, 0, 1, time);
        }
        function SetBoxText(box, text)
        {
            box.firstElementChild.innerHTML = text;
        }
        function SetBoxStyle(element, direction, opacity, time)
        {
            element.style.transition = time + "s";
            element.style.transform = "translateX(" + direction * 100 + "px) rotate(" + direction * 10 + "deg)";
            element.style.opacity = opacity;
        }

    //#endregion

    //#region ----Select Buttons----
    const leftButton = document.getElementById("left");
    const rightButton = document.getElementById("right");

    leftButton.addEventListener('click', () => Swipe(-1, 0, 0.5));
    rightButton.addEventListener('click', () => Swipe(1, 0, 0.5));

    document.addEventListener('keydown', (event) =>
    {
        let key = event.key;
        if(key === 'ArrowLeft') Swipe(-1, 0, 0.5);
        else if(key === 'ArrowRight') Swipe(1, 0, 0.5);
    });
    //#endregion

    //#region ----Result----

    function SetResult()
    {

    }

    //#endregion

//#endregion

//#region ----------------------LOGIN----------------------

    //#region Input Fields
    const nameField = document.getElementById('first-name');
    const lastNameField = document.getElementById('last-name');
    const codeField = document.getElementById('code');
    const emailField = document.getElementById('email');

    const errorMessage = document.getElementById('error-message');
    //#endregion
    //#region Login Button
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', LogIn);
    //#endregion

    let user = {};

    function LogIn()
    {
        user.name = nameField.value;
        user.lastName = lastNameField.value;
        user.code = parseInt(codeField.value);
        user.email = emailField.value;

        //#region Uncomplete Fields
        if(user.name === '' || user.lastName === '' || user.email === '' || codeField.value.length === 0)
        {
            errorMessage.innerHTML = 'Campos Incompletos';
            return;
        }
        if(codeField.value.length < 10)
        {
            errorMessage.innerHTML = 'Código Incompleto';
            return;
        }
        if(!ValidEmail(user.email))
        {
            errorMessage.innerHTML = 'Email Invalido';
            return;
        }
        //#endregion
        //#region Show Loading
        errorMessage.innerHTML = '';
        ChangeViewState(loginContainer, loginLoad);
        //#endregion

        fetch('https://tlsvocacional.renzoguido.com/api/check/student',
        {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then((response) => response.json())
        .then((result) =>
        {
            if(result.code == 1)
            {
                SetUsername(user.name + " " + user.lastName);
                GetSurvey();
            }
            else
            {
                errorMessage.innerHTML = 'Survey Already Completed';
                ChangeViewState(loginLoad, loginContainer);
            }
        })
        .catch(error =>
        {
            errorMessage.innerHTML = error.text;
            ChangeViewState(loginLoad, loginContainer);
        });
    }

    //#region Tutorial

    const tutorialButton = document.getElementById('tutorial-button');
    tutorialButton.addEventListener('click', CloseTutorial);

    function CloseTutorial()
    {
        ChangeViewState(tutorialView, null);
    }

    //#endregion

//#endregion

//#region ----------------------SURVEY---------------------

    //#region Session Storage
    let survey = JSON.parse(window.sessionStorage.getItem('survey'));
    let session = JSON.parse(window.sessionStorage.getItem('progress'));
    //#endregion
    //#region Json
    let json_category;
    fetch('../json/index.json').then(r => r.json()).then(j => json_category = j);

    var json_survey = {};
    json_survey.survey_id = 0;
    json_survey.answers = [];

    var json_session = {};
    json_session.questions = [];
    json_session.category = [];
    json_session.amount = [0, 0, 0, 0, 0, 0, 0];

    json_session.playing = false;

    json_session.total = 0;
    json_session.current = 0;
    json_session.progress = 0;
    //#endregion

    let gameQuestions = 6;

    //#region Get Session Data
    if(survey != null && session != null)
    {
        json_survey = survey;
        json_session = session;

        SetMiniGame();
        SelectVocation();
        SetProgressBar(false);
        ChangeViewState(loginView, surveyView);
        
        if(json_session.current < json_session.questions.length - 1)
        {
            SetBoxText(box1, json_session.questions[json_session.current].title);
        }
        else
        {
            ChangeViewState(questionary, result);
        }
    }
    //#endregion

    //#region Modify Json
    const AddAnswer = (id, value) =>
    {
        json_survey.answers.push(
        {
            "question_id" : id,
            "answer": value
        });
    };
    const AddCategory = (id) =>
    {
        const index = json_session.category.indexOf(id);
        json_session.amount[index] += 1;
        // console.log(json_session.amount);

        SelectVocation();
    };
    const SaveProgress = () =>
    {
        window.sessionStorage.setItem('survey', JSON.stringify(json_survey));
        window.sessionStorage.setItem('progress', JSON.stringify(json_session));
    };
    //#endregion
    //#region Fetch HTTPS
    function GetSurvey ()
    {
        //Set User Values
        json_survey.code = user.code;
        json_survey.name = user.name + " " + user.lastName;
        json_survey.email = user.email;

        fetch('https://tlsvocacional.renzoguido.com/api/survey',
        {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
        .then((response) => response.json())
        .then((result) =>
        {
            //Json
            // console.log(result);

            //Survey
            json_survey.survey_id = result.survey.id;

            //Session
            json_session.questions = result.survey.questions;
            json_session.category = idArray(result.survey.areas);
            json_session.total = json_session.questions.length - (gameQuestions * (levels.length - 2));
            
            //Random Questions
            shuffleArray(json_session.questions);
            // console.log(json_session.questions);

            if(json_session.questions.length != 0)
            {
                ChangeViewState(null, tutorialView);
                ChangeViewState(loginView, surveyView);
                SetBoxText(box1, json_session.questions[json_session.current].title);
            }
            else
            {
                errorMessage.innerHTML = 'Survey Error';
            }
        })
        .catch(error =>
        {
            console.error(error);
            if(!alert('Connection Error')) window.location.reload();
        });
    }
    function SendSurvey ()
    {
        ChangeViewState(questionary, result);
        SaveProgress();

        orderArray(json_survey.answers);
        console.log(json_survey);

        // fetch('https://tlsvocacional.renzoguido.com/api/survey',
        // {
        //     method: 'POST',
        //     headers: { 'Content-type': 'application/json' },
        //     body: JSON.stringify(json_survey)
        // })
        // .then((response) => response.json())
        // .then((values) => console.log(values));
    }
    //#endregion

//#endregion