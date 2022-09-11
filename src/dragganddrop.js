/** @type All the initial vars */
const limits = document.querySelector(".wrapper");
const dragElemsClass = ".draggable";
const dropAreasClass = ".drop-area";
const dragElems = document.querySelectorAll(dragElemsClass);
const dropAreas = document.querySelectorAll(dropAreasClass);
const btnOrderElements = limits.querySelector("#btn-order");
const btnAnswer = limits.querySelector("#btn-answer");
const btnContinue = limits.querySelector("#btn-continue");
const retroGrupo = document.querySelector(".retro-grupo");
const btnCierreCont = retroGrupo.querySelector("#btn-modal-continue");
let cantArr = [];
let success;
let isDebugging = false;

/**
 * @description Start of all the initial states od the dom elements
 * @author Leonardo Fonseca (cavera.de@gmail.com)
 */
const startDraggables = () => {
	btnAnswer.addEventListener("click", Responder);
	btnOrderElements.addEventListener("click", ordenarElementos);
	btnContinue.addEventListener("click", Continuar);
	btnCierreCont.addEventListener("click", CerrarRetro);

	btnOrderElements.classList.add("hidden");
	btnAnswer.classList.add("hidden");
	btnContinue.classList.add("hidden");

	dragElems.forEach((dragElem, key) => {
		dragElem.parentElement.id = `origin-${key + 1}`;
		dragElem.dataset.parent = dragElem.parentElement.id;

		if (isDebugging) dragElem.innerHTML = `${dragElem.dataset.parent}`;

		Draggable.create(dragElem, {
			type: "x,y",
			edgeResistance: 0.7,
			bounds: limits,
			autoScroll: 1,

			onDrag: isDragging,
			onDragParams: [dragElem],

			onDragEnd: hasDropped,
			onDragEndParams: [dragElem],
		});

		Draggable.zIndex = 120;
	});
};

const isDragging = (arrasEl) => {
	arrasEl.classList.add("dragging");
	const thisDraggable = Draggable.get(arrasEl);

	dropAreas.forEach((caja) => {
		let used = caja.classList.contains("occupied");

		if (thisDraggable.hitTest(caja, "50%") && !used) {
			caja.classList.add("able");
		} else {
			caja.classList.remove("able");
		}
	});

	let posicion = `pos : ${thisDraggable.x} : ${thisDraggable.y}`;
};

const hasDropped = (arrasEl) => {
	let encaja = false;
	arrasEl.classList.remove("dragging");
	dropAreas.forEach((caja) => {
		let thisDraggable = Draggable.get(arrasEl);
		let used = caja.classList.contains("occupied");

		if (thisDraggable.hitTest(caja, "50%") && !used) {
			centrarEn(arrasEl, caja);
			caja.classList.remove("able");

			encaja = true;
			verificarInfo();
		}
	});
	verifyUsedDropAreas();

	if (!encaja) Devolver(arrasEl);
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
	verifyUsedDropAreas();
	SUMAR(cantArr) < dropAreas.length ? btnAnswer.classList.add("hidden") : btnAnswer.classList.remove("hidden");
};

const Responder = () => {
	dragElems.forEach((dragElem) => {
		const dragElemGrupo = dragElem.dataset.group;
		const dropGrupo = dragElem.parentElement.dataset.group;
		let resultClass = dragElemGrupo === dropGrupo ? "good" : "bad";
		dragElem.classList.add(resultClass);
	});

	btnAnswer.classList.add("hidden");
	btnOrderElements.classList.remove("hidden");

	limits.classList.add("verificado");
};

const ordenarElementos = () => {
	console.log("ordenarElementos");

	dragElems.forEach((dragElem) => {
		const dragElemGrupo = dragElem.dataset.group;
		const wrongEl = dragElem.classList.contains("bad");
		const goodArea = limits.querySelector(`${dropAreasClass}[data-group='${dragElemGrupo}']`);

		dragElem.classList.remove("good", "bad");

		if (wrongEl) centrarEn(dragElem, goodArea);
	});

	btnOrderElements.classList.add("hidden");
	btnContinue.classList.remove("hidden");
};

const Continuar = () => {
	limits.classList.add("hidden");
	retroGrupo.classList.remove("hidden");

	let retroClass = success ? "retro-bien" : "retro-mal";
	retroGrupo.classList.add(retroClass);

	btnContinue.classList.add("hidden");
};

const CerrarRetro = () => {};

const SalirActividad = () => {};

/* utilidades */

const SUMAR = (myarray) => myarray.reduce((prevVal, curVal) => prevVal + curVal, 0);

const verifyUsedDropAreas = () => {
	cantArr = [];
	dropAreas.forEach((caja) => {
		if (caja.childElementCount > 0) {
			caja.classList.add("occupied");
			cantArr.push(1);
		} else {
			caja.classList.remove("occupied");
			cantArr.push(0);
		}
	});
};

/* iniciar */

startDraggables();
