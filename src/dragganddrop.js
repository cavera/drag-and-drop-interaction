const limites = document.querySelector(".wrapper");
const retroGrupo = document.querySelector(".retro-grupo");
const cajas = document.querySelectorAll(".caja");
const piezas = document.querySelectorAll(".arrastrable");
const cantidadico = piezas.length;
const btnVerificar = limites.querySelector(".verificar");
const btnResponder = limites.querySelector(".responder");
const btnContinuar = limites.querySelector(".continuar");
const btnCierreCont = retroGrupo.querySelector(".continuar");
const _tiempo = 300;
let _compara1 = [];
let _compara2 = [];
let cantArr = [];
let usados;
let exito;

iniEjercicio();

function iniEjercicio() {
	// btnResponder.on("click", Responder);
	// btnVerificar.on("click", ordenarElementos);
	// btnContinuar.on("click", Continuar);
	// btnCierreCont.on("click", CerrarRetro);
	// btnSalir.on("click", SalirActividad);

	for (var i = 0; i < cantidadico; i++) {
		const arrElem = piezas[i];
		const arrOrder = arrElem.dataset.orden;
		let orderEl = document.querySelector('[data-orden="' + (i + 1) + '"]');

		// solo para debug
		arrElem.append(arrOrder);
		// termina debug
		// arrElem.dataset.parent = arrElem.parentElement.
		arrElem.parentElement.id = `origin-${i}`;
		arrElem.dataset.parent = arrElem.parentElement.id;
		// arrElem.parentElement.dataset.orden = arrElem.dataset.orden;

		Draggable.create(arrElem, {
			type: "x,y",
			edgeResistance: 0.7,
			bounds: limites,
			autoScroll: 1,
			onDrag: Arrastrando,
			onDragParams: [arrElem],

			onDragEnd: Soltar,
			onDragEndParams: [arrElem, Number(arrOrder - 1)],
		});

		Draggable.zIndex = 120;
	}
}

function Arrastrando(elemento) {
	const arrasEl = elemento;

	arrasEl.classList.add("arrastrando");

	for (let i = 0; i < cantidadico; i++) {
		let dropped = cajas[i];

		let used = dropped.classList.contains("usado");

		// console.log({ dropped });

		if (used) {
			let d_obj = dropped.dataset.el;

			if (this === d_obj) {
				dropped.classList.remove("usado");

				console.warn("si");
			} else {
				console.warn("no");
			}
		}
	}

	let posicion = "pos : " + this.x + " : " + this.y;
	// console.log({ posicion });
}

function Soltar(args, numero) {
	console.log(args);
	console.warn("Soltar");
	const arrasEl = args;
	let encaja = false;
	arrasEl.classList.remove("arrastrando");

	for (var i = 0; i < cajas.length; i++) {
		var dropped = cajas[i];
		if (this.hitTest(dropped)) {
			console.warn(numero + " : " + i);

			_compara1[i] = numero;
			_compara2[i] = i;

			// console.log(_compara1 + ' : ' + _compara2);

			arrasEl.classList.add("recibido");

			centrarEn(arrasEl, dropped);

			let used = dropped.classList.contains("usado");
			console.log("dropped used : " + used);

			if (used) {
				let d_obj = dropped.dataset.el;

				if (this !== d_obj) {
					Devolver(d_obj.target);
				}
			}

			dropped.dataset.el = this;
			dropped.classList.add("usado");

			encaja = true;
			verificarInfo();
			break;
		} else {
			arrasEl.classList.remove("recibido");
		}
	}

	if (!encaja) {
		Devolver(arrasEl);
	}
}

function Devolver(el) {
	arContainer = document.getElementById(el.dataset.parent);

	arContainer.append(el);
	gsap.set(el, { clearProps: "transform" });

	verificarInfo();
}

function centrarEn(elemento, ubicacion) {
	ubicacion.appendChild(elemento);
	gsap.set(elemento, { clearProps: "transform" });
}

function verificarInfo() {
	for (let j = 0; j < cantidadico; j++) {
		let dropped = cajas[j];
		let used = dropped.classList.contains("usado");

		cantArr[j] = used ? 1 : 0;
	}

	// console.log('cantArr : ' + cantArr);

	usados = sumar(cantArr);
	// console.log('cajas : ' + cajas.length);

	if (usados < cajas.length) {
		btnResponder.style.display = "none";
	} else {
		btnResponder.style.display = "";
	}
}

function Responder() {
	// console.log('_compara1 : ' + _compara1);
	// console.log('_compara2 : ' + _compara2);

	for (var j = 0; j < cajas.length; j++) {
		var caja = $(cajas[j]),
			arrasEl = $(caja.data("el").target);

		var comparable1 = caja.data("grupo");
		var comparable2 = $(caja.data("el").target).data("grupo");

		console.log("comparables: " + j + " - " + comparable1 + " : " + comparable2);

		if (comparable1 === comparable2) {
			arrasEl.prepend(iconCheck);
		} else {
			arrasEl.prepend(iconAspa);
			exito = false;
		}
	}

	btnResponder.style.display = "none";
	btnVerificar.style.display = "";

	limites.classList.add("verificado");
}

function ordenarElementos() {
	console.log("ordenarElementos");

	for (var k = 0; k < cantidadico; k++) {
		var arrasEl = $(piezas[k]),
			ps = $("#p" + (k + 1)),
			cs = $("#c" + (k + 1));

		if (k >= cajas.length) {
			ps.css("opacity", "0");
			ps.hide();
		} else {
			arrasEl.removeClass("recibido").addClass("ordenado");
		}

		arrasEl.find("[class*=icon-]").remove();
		Draggable.get(arrasEl).kill();

		if (k < cajas.length) {
			if (!exito) {
				centrarEn(ps, cs);
			}
		}
	}

	btnVerificar.hide();
	btnContinuar.show();
}

function Continuar() {
	if (exito) {
		window.PLANTILLA.setDato("obligacion", false);
	} else {
		window.PLANTILLA.setDato("obligacion", true);
	}

	limites.slideUp(_tiempo);
	retroGrupo.slideDown(_tiempo);
	console.log("exito : " + exito);
	if (exito) {
		retroGrupo.addClass("retro-bien");
		window.AUDIO.playAudio(audioBien);
		window.AUDIO.playFx("correcto");
	} else {
		retroGrupo.addClass("retro-mal");
		window.AUDIO.playAudio(audioMal);
		window.AUDIO.playFx("incorrecto");
	}
	btnContinuar.hide();
}

function CerrarRetro() {
	retroGrupo.slideUp(_tiempo);
	if (!salto) {
		window.AUDIO.playAudio(audioCierre);
		compCierre.slideDown(_tiempo);
	}
	limites.slideUp(_tiempo);

	SalirActividad();
}

function SalirActividad() {
	window.PLANTILLA.contenidoVisto();
	window.PLANTILLA.cargarSiguiente();
}

function sumar(myarray) {
	var total = 0;
	for (i = 0; i < myarray.length; i++) {
		if (!isNaN(myarray[i])) {
			total += myarray[i];
		}
	}
	// console.log('suma : ' + total);
	return total;
}
