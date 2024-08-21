//import data from './files/paises.json' assert {type:'json'};
const body=document.querySelector('.contenedor');
const modal=document.querySelector('.modal');
const lista_faltantes=document.querySelector('.lista_faltantes');
const cerrar=document.querySelector('.cerrar');
const size=window.innerWidth;

let indice;
let faltantes=[];
let contador=0;
let id_previo,id_actual;
let estado_botones=0;
cerrar.addEventListener('click',()=>{
	modal.style.opacity='0';
	setTimeout(e=>modal.classList.toggle('oculto'),500);
});

leerPaises();

async function leerPaises() {
  const requestURL ="https://raw.githubusercontent.com/joangute/divisas/main/files/paises.json";
  const request = new Request(requestURL);
  const response = await fetch(request);
  const paises = await response.json();

  const requestURL2 ="https://raw.githubusercontent.com/joangute/divisas/main/files/divisas.json";
  const request2 = new Request(requestURL2);
  const response2 = await fetch(request2);
  const divisas = await response2.json();

  llenarPaises(paises);
  convertirDivisas(paises,divisas);
}


function llenarPaises(obj){
	
	let centro=[];
	let norte=[];
	let sur=[];
	let cadena=[7,15,22,1,5,6,8,9,13,26,33,34];
	if(size>480){

		for (let i=0;i<obj.length;i++){

			if(obj[i].continent=='Centro'){
				centro.push(i);
			}
			if(obj[i].continent=='Norte'){
				norte.push(i);
			}
			if(obj[i].continent=='Sur'){
				sur.push(i);
			}
		}

		norte.forEach(e=>llenarPagina(obj,e));
		sur.forEach(e=>llenarPagina(obj,e));
		for(let j=0;j<centro.length;j++){
			if(j<3){
				 llenarPagina(obj,centro[j]);
			}
	    else{
	    	faltantes.push(centro[j]);
	    }
		}
	}
	else{
		cadena.forEach(e=>llenarPagina(obj,e));
		for(let i=0;i<35;i++){
			if (cadena.indexOf(i)==-1){
				faltantes.push(i);
			}
		}
	}
	

	elementosFaltantes(obj);
}


function llenarPagina(obj,i){

		let container, container2, container3, bandera, nombre, input, codigo,botones,cambiar,ordenar,botonCambiar,botonOrdenar;

		container= document.createElement('div');
		container.classList.add('container','flex');
		container.setAttribute('id',i);

		container2= document.createElement('div');
	  container2.classList.add('container2');

		container3= document.createElement('div');
		container3.classList.add('container3');

		bandera=document.createElement('span');
		bandera.classList.add('bandera');
		bandera.style.backgroundImage=`url(${obj[i].flag})`;

		nombre=document.createElement('span');
		nombre.textContent=obj[i].name;

		container2.appendChild(nombre);
		container2.appendChild(bandera);

		input=document.createElement('input');
		input.setAttribute('type','text');
		input.setAttribute('placeholder',`${obj[i].currency.symbol_native} 0.0`);
		container3.appendChild(input);
        
    codigo=document.createElement('span');
    codigo.textContent=obj[i].currency.code;
    container3.appendChild(codigo);

    botones=document.createElement('div');
    botones.classList.add('botones','flex');

    cambiar=document.createElement('div');
    cambiar.classList.add('cambiar');

    ordenar=document.createElement('div');
    ordenar.classList.add('ordenar');

    botones.appendChild(cambiar);
    botones.appendChild(ordenar);

    if(size>480){
    botonCambiar=cambiar;
    botonOrdenar=ordenar;
   	bandera.addEventListener('mouseenter',e=>{
			botones.classList.add('invisible');
			setTimeout(()=>{
				botones.addEventListener('mouseenter',x=>estado_botones=1);
				if(estado_botones==0){
				botones.classList.remove('invisible');
			}
			},300);
			
		});
	
		botones.addEventListener('mouseleave',e=>{
			botones.classList.remove('invisible');
			estado_botones=0;
		});
   }
   else{
       botonCambiar=nombre;
       botonOrdenar=bandera;
   }

 
    botonCambiar.addEventListener('click', ()=>{
    	modal.classList.toggle('oculto');
    	modal.querySelector('h2').textContent=`Cambiar ${obj[i].name} por:`;
    	modal.style.opacity='1';
    	indice=container.id;
    });


    botonOrdenar.addEventListener('click',()=>{
    	contador++;
      if(contador<2){
 				container.classList.toggle('seleccionado');
 				id_previo=container.id;
      }
      else{
      	container.classList.toggle('seleccionado');

      	setTimeout(()=>{
      		let caja=document.querySelector(`.container[id='${id_previo}']`);
      		let cajaValue=caja.querySelector('.container3>input').value;
         container.classList.toggle('seleccionado');
         caja.classList.toggle('seleccionado');
         
         container.querySelector('.container2>.bandera').style.backgroundImage=`url('${obj[id_previo].flag}')`;
				 container.querySelector('.container2>span:nth-child(1)').textContent=obj[id_previo].name;
				 container.querySelector('.container3>span').textContent=obj[id_previo].currency.code;
				 container.querySelector('.container3>input').placeholder=obj[id_previo].currency.symbol_native;
			
				 caja.querySelector('.container2>.bandera').style.backgroundImage=`url('${obj[container.id].flag}')`;
				 caja.querySelector('.container2>span:nth-child(1)').textContent=obj[container.id].name;
				 caja.querySelector('.container3>span').textContent=obj[container.id].currency.code;
				 caja.querySelector('.container3>input').placeholder=obj[container.id].currency.symbol_native;

          caja.querySelector('.container3>input').value=container.querySelector('.container3>input').value;
          container.querySelector('.container3>input').value=cajaValue;
				 caja.id=container.id;
				 container.id=id_previo;

      	},300);
      	contador=0;
      }
    });


		container.appendChild(container2);
		container.appendChild(container3);
		container.appendChild(botones);
		body.appendChild(container);
}

function convertirDivisas(obj,obj2){

	const inputs=document.querySelectorAll('input[type="text"]');
	const containers=document.querySelectorAll('.container');
	let val,temp_value;
	const exp=/(^[0-9]+\.[0-9]+?)|(^[0-9]+\.?)|(^[0-9]+?)/;

		for (let i=0;i<inputs.length;i++){

			inputs[i].addEventListener('input',e=>{
			if(!exp.test(inputs[i].value)){
				 	temp_value=inputs[i].value;
				 	temp_value=temp_value.substr(0,temp_value.length-2);
				 	inputs[i].value=temp_value;
				}
			else{
				 	val=inputs[i].value/obj2.data[obj[containers[i].id].currency.code].value;
				 	for(let j=0;j<inputs.length;j++){
				 		if(j!=i){
				 			inputs[j].value=(val*obj2.data[obj[containers[j].id].currency.code].value).toFixed(2);	
				 		}
				 }			     	
			}
			if(inputs[i].value==''){
				 		inputs.forEach(e=>e.value='');
				 }                
			});
		}
}
		

function elementosFaltantes(obj){
	let elemento,bandera,nombre;

	for(let i=0;i<faltantes.length;i++){

	  		elemento=document.createElement('div');
	  		elemento.classList.add('elemento_faltante');
	  		elemento.setAttribute('id',faltantes[i]);

	  		bandera= document.createElement('span');
	  		bandera.classList.add('bandera_faltante');
	  		bandera.style.backgroundImage=`url('${obj[faltantes[i]].flag}')`;
	  		
	  		nombre=document.createElement('span');
	  		nombre.classList.add('nombre_faltante');
	  		nombre.textContent=obj[faltantes[i]].name;

	  		elemento.appendChild(bandera);
	  		elemento.appendChild(nombre);
	  		elemento.addEventListener('dblclick',e=>{

              let caja=document.querySelector(`.container[id='${indice}']`);		    
		     			caja.id=faltantes[i];
		     			
		     			caja.querySelector('.container2>.bandera').style.backgroundImage=`url('${obj[faltantes[i]].flag}')`;
				 			caja.querySelector('.container2>span:nth-child(1)').textContent=obj[faltantes[i]].name;
				 			caja.querySelector('.container3>span').textContent=obj[faltantes[i]].currency.code;
				 			caja.querySelector('.container3>input').placeholder=obj[faltantes[i]].currency.symbol_native;
		     			e.currentTarget.querySelector('.bandera_faltante').style.backgroundImage=`url(${obj[indice].flag})`;
		     			e.currentTarget.querySelector('.nombre_faltante').textContent=obj[indice].name;
		     			faltantes[i]=indice;
		     			e.currentTarget.id=indice;
		     			modal.style.opacity='0';
		     			setTimeout(e=>modal.classList.toggle('oculto'),500);
		     				
		  	});
	  		lista_faltantes.appendChild(elemento);  
		}
}

/*function masMenos(obj){
	const mas_menos=document.querySelector('.mas_menos');
	let toggle=true;
	mas_menos.addEventListener('click',()=>{

		if(toggle)
		{
			for(let i=0;i<faltantes.length; i++)
		   {
		   	llenarPagina(obj,faltantes[i]);
		   }
		   mas_menos.textContent='Menos';
		   toggle=false;
		}
		else{
			let containers=document.querySelectorAll('.container')	
			for( let i=18; i<35; i++){
		      containers[i].remove();
		      valor.pop();
			}
			mas_menos.textContent='Más';
			toggle=true;
		} 
	});
}*/

 
