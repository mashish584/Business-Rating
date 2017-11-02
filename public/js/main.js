
//code block to avoid default variables declaration errors
{
  //javascript in 'strict' mode
  'use strict'; 

   //functions to get element or elements

   const _el    = element => document.querySelector(element),
        __el    = element => document.querySelectorAll(element);

  //function to get container type from body on the basis of its id

  const getContainer = () => {
      //getting all the elements of body in a nodeList
        const elements = document.body.childNodes;
        let value; 
      //looping through each node to chek for id 
        elements.forEach((element) =>  {
          if(element.id == "content-wrapper") value = true;
       }); 

        return value ? value : false;

  };
  

  /************************************************************
  * Logics and variable decalarations
  * starts from here
  *************************************************************/


   //Vaiables declarations

   const container     =   _el(getContainer()?'#content-wrapper':'#form-wrapper'),
         menuButtons   =  __el('.navbar-btn button'),
         dropdown      =   _el('.dropdown'),
         menuDrop      =   _el('.dropdown-menu'),
         sideNav       =   _el('.side-menu'),
         switches      =   __el('.settings--switch'),
         state         =   _el('#state');

  let toggleState      =   false;



  /******************************************
   looping through menuButtons 
   objext and adding event listener on it...
  ********************************************/
  
  for (let button of menuButtons){
     //adding event listener on each button
     button.addEventListener('click', () => {
       if(button.dataset.id == "open"){
        //set class overflow on body element
        _el('body').classList.add('overflow');
        // make side navigation visible
        sideNav.classList.add('visible');
        //add .open-nav class to content-wrapper
        container.classList.add('open-nav');
        //hide this button
        button.classList.add('hide');
        //show next button
        button.nextElementSibling.classList.remove('hide');
       }else{
        //remove class overflow on body element
        _el('body').classList.remove('overflow');
        // make side navigation invisible
        sideNav.classList.remove('visible');
        //remove .open-nav class from content-wrapper
        container.classList.remove('open-nav');
        //hide this button
        button.classList.add('hide');
        //show previous button
        button.previousElementSibling.classList.remove('hide');
       }
     });
  }

  /**************************************************
   Show dropdown with some transition
   on click event
  ***************************************************/
   
 if(dropdown){
     dropdown.addEventListener('click',() => {
        //toggle class show-dropdown on dropdown-menu
        if(!toggleState) {
          toggleState = !toggleState; //switch toogle state
          menuDrop.classList.add('show-dropdown');
        }else{
          toggleState = !toggleState; //switch toggle state
          menuDrop.classList.remove('show-dropdown');
        }
    });
 }

 /********************************************************
  Looping through user profile
  switch buttons and adding event listener 
  on it.
 ************************************************************/
 for(let tab of switches){
    //adding event listener
    tab.addEventListener('click',(e) => {
      //stopping default action
      e.preventDefault();
      if(tab.dataset.target == "bio"){
        //add active class on parent element
        tab.parentElement.classList.add('active');
        //remove active from next sibling of parent element
        tab.parentElement.nextElementSibling.classList.remove('active');
        //hide form-two
        _el('#form-two').style.display = 'none';
        //show form-one
        _el('#form-one').style.display = 'block';
      }else{
        //add active class on parent element
        tab.parentElement.classList.add('active');
        //remove active from previous sibling of parent element
        tab.parentElement.previousElementSibling.classList.remove('active');
        //hide form-one
        _el('#form-one').style.display = 'none';
        //show form-two
        _el('#form-two').style.display = 'block';
      }
    });
 }
  

  //loading cities from backend
  if(state){
    state.addEventListener('change',function(e){
      e.preventDefault();
      axios.get('/getCities?state='+e.target.value)
      .then(function (response) {
        let cities = response.data.cities;
        let html = "";
            html += "<option selected disabled>Select City</option>";
        cities.forEach(function(city){
          html += "<option value="+city+">"+city+"</option>";
        });
        _el("#cities").innerHTML = html;
      })
      .catch(function (error) {
        console.error(error);
      });
    });
  }

  //saving company data 
  if(_el('#add-company')){
    _el('#add-company').addEventListener('submit',function(e){
      e.preventDefault();
      const data = new FormData(this);
        axios.post('/company/add',data)
        .then(function(response){
          if(response.data.error){
            _el('#flashes').innerHTML = "<div class='flash-error'>"+ response.data.error +"</div>";
          }
          if(response.data.success){
            _el('#flashes').innerHTML = "<div class='flash-success'>"+ response.data.success +"</div>";
             //reset form on success
            _el('#add-company').reset();
          }
        })
        .catch(function(error){
          console.error(error);
        })
    });
  }

}