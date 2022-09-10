const limites = document.querySelector(".wrapper");
const retroGrupo = document.querySelector(".retro-grupo");
const cajas = document.querySelectorAll(".drop-area");
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

const iniEjercicio = () => {
	// btnResponder.on("click", Responder);
	// btnVerificar.on("click", ordenarElementos);
	// btnContinuar.on("click", Continuar);
	// btnCierreCont.on("click", CerrarRetro);
	// btnSalir.on("click", SalirActividad);

	btnVerificar.style.display = "none";
	btnResponder.style.display = "none";
	btnContinuar.style.display = "none";

	for (var i = 0; i < cantidadico; i++) {
		const arrElem = piezas[i];
		const arrGroup = arrElem.dataset.group;
		let groupEl = document.querySelector('[data-group="' + (i + 1) + '"]');

		arrElem.parentElement.id = `origin-${i}`;
		arrElem.dataset.parent = arrElem.parentElement.id;

		// solo para debug
		arrElem.append(arrElem.dataset.parent);
		// termina debug

		Draggable.create(arrElem, {
			type: "x,y",
			edgeResistance: 0.7,
			bounds: limites,
			autoScroll: 1,
			onDrag: Arrastrando,
			onDragParams: [arrElem],

			onDragEnd: Soltar,
			onDragEndParams: [arrElem, Number(arrGroup - 1), this],
		});

		Draggable.zIndex = 120;
	}
};

const Arrastrando = function (elemento) {
	const arrasEl = elemento;

	arrasEl.classList.add("arrastrando");

	for (let i = 0; i < cantidadico; i++) {
		let dropped = cajas[i];

		if (this.hitTest(dropped, "90%")) {
			// console.log({ dropped });
			// dropped.style.height = `${arrasEl.clientHeight}px`;
			// console.log(arrasEl.offsetHeight);
		} else {
			// dropped.style.height = ``;
		}

		let used = dropped.classList.contains("usado");

		if (used) {
			let d_obj = dropped.dataset.el;

			if (this === d_obj) {
				dropped.classList.remove("usado");

				// console.warn("si");
			} else {
				// console.warn("no");
			}
		}
	}

	let posicion = "pos : " + this.x + " : " + this.y;
	// console.log({ posicion });
};

const Soltar = function (args, numero) {
	let arrasEl = args;
	let encaja = false;
	arrasEl.classList.remove("arrastrando");
	for (let i = 0; i < cajas.length; i++) {
		let dropped = cajas[i];
		if (this.hitTest(dropped, 20)) {
			_compara1[i] = numero;
			_compara2[i] = i;

			console.log(_compara1 + " : " + _compara2);

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

			dropped.dataset.el = String(this.target);
			console.log(this);
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
};

const Devolver = function (el) {
	let elParent = el.getAttribute("data-parent");
	let arContainer = document.getElementById(elParent);
	arContainer.append(el);
	gsap.set(el, { clearProps: "transform" });
	verificarInfo();
};

const centrarEn = (elemento, ubicacion) => {
	console.log("centrarEn");
	ubicacion.appendChild(elemento);
	gsap.set(elemento, { clearProps: "transform" });
};

const verificarInfo = () => {
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
};

const Responder = () => {
	// console.log('_compara1 : ' + _compara1);
	// console.log('_compara2 : ' + _compara2);

	for (let j = 0; j < cajas.length; j++) {
		const caja = cajas[j];
		const arrasEl = caja.dataset.el.target;

		const comparable1 = caja.dataset.grupo;
		const comparable2 = caja.data.set.el.target.data.grupo;

		console.log("comparables: " + j + " - " + comparable1 + " : " + comparable2);

		if (comparable1 === comparable2) {
			arrasEl.classList.add("good");
		} else {
			arrasEl.classList.add("bad");
			exito = false;
		}
	}

	btnResponder.style.display = "none";
	btnVerificar.style.display = "";

	limites.classList.add("verificado");
};

const ordenarElementos = () => {
	console.log("ordenarElementos");

	for (let k = 0; k < cantidadico; k++) {
		const arrasEl = piezas[k];
		const ps = document.querySelector("#p" + (k + 1));
		const cs = document.querySelector("#c" + (k + 1));

		if (k >= cajas.length) {
			ps.style.opacity = 0;
			ps.style.display = "none";
		} else {
			arrasEl.classList.remove("recibido");
			arrasEl.classList.add("ordenado");
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
};

const Continuar = () => {
	limites.slideUp(_tiempo);
	retroGrupo.slideDown(_tiempo);
	console.log("exito : " + exito);
	if (exito) {
		retroGrupo.addClass("retro-bien");
	} else {
		retroGrupo.addClass("retro-mal");
	}
	btnContinuar.hide();
};

const CerrarRetro = () => {};

const SalirActividad = () => {};

const sumar = (myarray) => {
	const total = myarray.reduce((prevVal, curVal) => prevVal + curVal, 0);

	console.log("suma : " + total);
	return total;
};

iniEjercicio();
