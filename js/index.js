const path = "https://dazzling-cray-d6262f.netlify.app";

//#region --------------------Elements---------------------

    //#region Login

        //Container
        const loginView = document.getElementById('login');

        const loginLoad = document.getElementById('loading');
        const loginContainer = document.getElementById('login-container');

        //Inputs
        const nameField = document.getElementById('first-name');
        const lastNameField = document.getElementById('last-name');
        const codeField = document.getElementById('code');
        const emailField = document.getElementById('email');

        //Log
        const errorMessage = document.getElementById('error-message');

    //#endregion
    //#region Survey

        const surveyView = document.getElementById('survey');
        
        //#region Category

            //Username
            const textContainer = document.getElementById('text-container');
            const username = document.getElementById('username');

            //List
            const list = document.querySelectorAll('.list');

        //#endregion
        
        //#region Tutorial

            const tutorialView = document.getElementById('tutorial');

        //#endregion
        //#region Questions

            //Container
            const questionary = document.getElementById('questionary');
            const game = document.getElementById('minigame');

            //Progress Bar
            const percent = document.getElementById("amount");
            const levels = document.getElementsByClassName("progress");
            const bar = document.getElementById("fill-amount");

            //Box
            const qBox = document.getElementById("question-box");
            const box1 = qBox.firstElementChild;
            const box2 = qBox.lastElementChild;

        //#endregion
        //#region Result

            const result = document.getElementById('result');

            const rTittle = document.getElementById('result-tittle');
            const rImage = document.getElementById('result-image');
            const rInfo = document.getElementById('result-info');

        //#endregion

    //#endregion

//#endregion

//#region ----------------------HTML-----------------------

    let documentJson = window.sessionStorage.getItem('document') == "" ? "" : JSON.parse(window.sessionStorage.getItem('document'));
    fetch(/*path +*/ '/json/index.json', { method:'GET', headers: { 'Content-type': 'application/json' } })
    .then((response) => response.json()).then((result) => documentJson = result);

    //#region -----Category-----

    //Set Images
    // for(let i = 1; i < 7; i++)
    // {
    //     list[i].firstChild.src = path + "/assets/header/Imagen" + i + ".png";
    // }

    //#endregion 
    //#region ------Inputs------
    
        //Login
        document.getElementsByClassName('numeric').forEach(i => i.addEventListener("keydown", InvalidInput));
        document.getElementById('login-button').addEventListener('click', LogIn);

        //Tutorial
        document.getElementById('tutorial-button').addEventListener('click', Tutorial);

        //Gameplay
        document.getElementById('shoot').addEventListener('click', () => Shoot());
        
        //Swipe Buttons
        document.getElementById("left").addEventListener('click', () => Swipe(-1, 0, 0.5));
        document.getElementById("right").addEventListener('click', () => Swipe(1, 0, 0.5));

        let press = false;
        document.addEventListener('keydown', (event) =>
        {
            if(!press)
            {
                let key = event.key;
                if(key === 'ArrowLeft') { Swipe(-1, 0, 0.5); press = true; }
                else if(key === 'ArrowRight') { Swipe(1, 0, 0.5); press = true; }
            }
        });
        document.addEventListener('keyup', (event) =>
        {
            if(press)
            {
                let key = event.key;
                if(key === 'ArrowLeft' || key === 'ArrowRight') press = false;
            }
        });

    //#endregion

    //#region ----Fade Scenes----

        function ChangeViewState(from, to)
        {
            from?.classList.replace('enable', 'disable');
            to?.classList.replace('disable', 'enable');
        }

    //#endregion

    //#region ----Category----

        function SetUsername(string)
        {
            username.innerHTML = string.toString();
            textFit(textContainer);
        }
        function GetVocation()
        {
            const max = Math.max.apply(null, json_session.amount);
            return index = json_session.amount.indexOf(max);
        }
        function SelectVocation()
        {
            const index = GetVocation();

            for(i = 0; i < list.length; i++)
            {
                if(i != index) list[i].classList.remove('active');
                else list[i].classList.add('active');
            }
        }

    //#endregion

    //#region ----Progress Bar----

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
            json_session.progress = Math.round(json_session.progress);
            SetProgressBar(true);
            SetMiniGame();

            //Swipe effect
            let element1 = currentBox == 0 ? box1 : box2;
            let element2 = currentBox == 0 ? box2 : box1;
            SetBoxStyle(element1, dir, opacity, time);
            SetBoxStyle(element2, 0, 0, 0);

            //Await to complete minigame
            await until(() => json_session.playing == false);

            //Complete Survey
            if(json_session.progress >= 100) { SetResult(); return; };
            
            //Swipe Delay
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

    //#region ----Result----

    function SetResult()
    {
        const index = GetVocation() + 1;

        rTittle.innerHTML = documentJson.category[index].name;
        rInfo.innerHTML = documentJson.category[index].info;

        rImage.src = /*path +*/ "../assets/header/Imagen" + index + ".svg";
        
        ChangeViewState(questionary, result);
        SaveProgress();

        orderArray(json_survey.answers);
        if(!json_session.complete) SendSurvey();
    }

    //#endregion

//#endregion

//#region ----------------------LOGIN----------------------

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

        // fetch('https://tlsvocacional.renzoguido.com/api/check/student',
        // {
        //     method: 'POST',
        //     headers: { 'Content-type': 'application/json' },
        //     body: JSON.stringify(user)
        // })
        // .then((response) => response.json())
        // .then((result) =>
        // {
            // if(result.code == 1)
            // {
                SetUsername(user.name + " " + user.lastName);
                GetSurvey();
            // }
            // else
            // {
            //     errorMessage.innerHTML = 'Survey Already Completed';
            //     ChangeViewState(loginLoad, loginContainer);
            // }
        // })
        // .catch(error =>
        // {
        //     errorMessage.innerHTML = error.text;
        //     ChangeViewState(loginLoad, loginContainer);
        // });
    }
    function Tutorial()
    {
        ChangeViewState(tutorialView, null);
    }

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
    json_session.complete = false;

    json_session.total = 0;
    json_session.current = 0;
    json_session.progress = 0;
    //#endregion

    //set gameplay number
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
        
        if(json_session.current < json_session.total - 1)
        {
            SetBoxText(box1, json_session.questions[json_session.current].title);
        }
        else
        {
            SetResult();
        }
    }
    else
    {
        ChangeViewState(loginLoad, loginContainer);
    }
    //#endregion

    //#region Modify Json
    function SaveProgress()
    {
        window.sessionStorage.setItem('survey', JSON.stringify(json_survey));
        window.sessionStorage.setItem('progress', JSON.stringify(json_session));
        window.sessionStorage.setItem('document', JSON.stringify(documentJson));
    };
    function AddCategory(id)
    {
        const index = json_session.category.indexOf(id);
        json_session.amount[index] += 1;
        SelectVocation();
    };
    function AddAnswer(id, value)
    {
        json_survey.answers.push({ "question_id" : id, "answer": value });
    };
    //#endregion
    //#region Fetch HTTPS
    function GetSurvey ()
    {
        //Set User Values
        json_survey.code = user.code;
        json_survey.name = user.name + " " + user.lastName;
        json_survey.email = user.email;

        fetch(/*'https://tlsvocacional.renzoguido.com/api/survey'*/ '/json/preguntas.json',
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

            if(json_session.questions.length != 0)
            {
                ChangeViewState(null, tutorialView);
                ChangeViewState(loginView, surveyView);
                SetBoxText(box1, json_session.questions[json_session.current].title);
            }
            else
            {
                ChangeViewState(loginLoad, loginView);
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
        // fetch('https://tlsvocacional.renzoguido.com/api/survey',
        // {
        //     method: 'POST',
        //     headers: { 'Content-type': 'application/json' },
        //     body: JSON.stringify(json_survey)
        // })
        // .then((response) => response.json())
        // .then((values) =>
        // {
            json_session.complete = true;
        //     console.log(values);
            SaveProgress();
        // })
        // .catch(error =>
        // {
        //     console.error(error);
        //     if(!alert('Connection Error')) window.location.reload();
        // });
    }
    //#endregion

//#endregion