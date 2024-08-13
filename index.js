const body=document.querySelector('.contenedor');
//let valorDivisa=[];


async function leerPaises() {
  const requestURL ="https://raw.githubusercontent.com/joangute/divisas/main/files/paises.json";
  const request = new Request(requestURL);
  const response = await fetch(request);
  const paises = await response.json();

     const requestURL2 ="https://api.currencyapi.com/v3/latest?apikey=cur_live_tlAfemQ2aMiI5ryJZBXUsXLgxKndTe5rmOzgmgT3";
  const request2 = new Request(requestURL2);
  const response2 = await fetch(request2);
  const divisas = await response2.json();

  llenarPaises(paises,divisas);
}


function llenarPaises(obj,obj2){

	let x=0;
	let container,bandera,nombre, container2, container3, input,codigo;
	let valor=[];
	for (let i=0;i<obj.length;i++){
		container= document.createElement('div');
		container.classList.add('container');

		container2= document.createElement('div');
		container2.classList.add('container2');

		container3= document.createElement('div');
		container3.classList.add('container3');

		bandera=document.createElement('span');
		bandera.classList.add('bandera');
		bandera.style.backgroundImage=`url(${obj[i].flag})`;
		container2.appendChild(bandera);

		nombre=document.createElement('span');
		nombre.textContent=obj[i].name;
		container2.appendChild(nombre);

		container.appendChild(container2);

		input=document.createElement('input');
		input.setAttribute('type','text');
		input.setAttribute('placeholder',`${obj[i].currency.symbol_native} 0.0`);
		container3.appendChild(input);
        
        codigo=document.createElement('span');
        codigo.textContent=obj[i].currency.code;
        container3.appendChild(codigo);

		container.appendChild(container3);

		body.appendChild(container);
        valor.push(obj[i].currency.code);
		}
		const inputs=document.querySelectorAll('input');
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
				 	val=inputs[i].value/obj2.data[valor[i]].value;
				 	for(let j=0;j<inputs.length;j++){
				 		if(j!=i){
				 		inputs[j].value=(val*obj2.data[valor[j]].value).toFixed(2);	
				 		}
				 	}
			     	
				 }
				if(inputs[i].value==''){
				 		inputs.forEach(e=>e.value='');
				 	}
                
			});
		}

	}
	
leerPaises();

