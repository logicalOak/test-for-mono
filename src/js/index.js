document.addEventListener('DOMContentLoaded', function () {
	// map
	function init() {
		let map = new ymaps.Map('map', {
			center: [55.17630703499772, 39.4789277226596],
			zoom: 6,
		});

		let placemark = new ymaps.Placemark(
			[54.66139297397919, 39.74807384064804],
			{},
			{
				iconLayout: 'default#image',
				iconImageHref: '../img/marker.svg',
				iconImageSize: [36, 40],
				iconImageOffset: [-15, -55],
			},
		);
		let placemarkMsk = new ymaps.Placemark(
			[55.753655905340665, 37.633224597659606],
			{},
			{
				iconLayout: 'default#image',
				iconImageHref: '../img/marker.svg',
				iconImageSize: [36, 40],
				iconImageOffset: [-15, -55],
			},
		);
		let placemarkTmb = new ymaps.Placemark(
			[52.788278068229104, 41.46912479712747],
			{},
			{
				iconLayout: 'default#image',
				iconImageHref: '../img/marker.svg',
				iconImageSize: [36, 40],
				iconImageOffset: [-15, -55],
			},
		);
		let placemarkMns = new ymaps.Placemark(
			[53.969996242020144, 27.561777189869517],
			{},
			{
				iconLayout: 'default#image',
				iconImageHref: '../img/marker.svg',
				iconImageSize: [36, 40],
				iconImageOffset: [-15, -55],
			},
		);
		let placemarkKzn = new ymaps.Placemark(
			[55.866843253660306, 49.11998455804014],
			{},
			{
				iconLayout: 'default#image',
				iconImageHref: '../img/marker.svg',
				iconImageSize: [36, 40],
				iconImageOffset: [-15, -50],
			},
		);

		map.geoObjects.add(placemark);
		map.geoObjects.add(placemarkMsk);
		map.geoObjects.add(placemarkTmb);
		map.geoObjects.add(placemarkMns);
		map.geoObjects.add(placemarkKzn);

		map.controls.remove('geolocationControl');
		map.controls.remove('trafficControl');
		map.controls.remove('typeSelector');
		map.controls.remove('fullscreenControl');
		map.controls.remove('searchControl');
		map.controls.remove('zoomControl');
		map.controls.remove('rulerControl');
	}

	ymaps.ready(init);

	// form
	const nameInput = document.querySelector('#name');
	const phoneInput = document.querySelector('#phone');
	const checkboxInput = document.querySelector('#checkbox');

	const form = document.querySelector('#form');

	const checkUsername = () => {
		let valid = false;

		const min = 3,
			max = 25;

		const username = nameInput.value.trim();

		if (!isRequired(username)) {
			showError(nameInput, 'Является обязательным полем');
			showInputError(nameInput);
		} else if (!isBetween(username.length, min, max)) {
			showError(nameInput, `Имя должно содержать от ${min} до ${max} символов.`);
			showInputError(nameInput);
		} else {
			showSuccess(nameInput);
			removeInputError(nameInput);
			valid = true;
		}
		return valid;
	};

	const checkUserPhone = () => {
		let valid = false;
		const phone = phoneInput.value.trim();
		if (!isRequired(phone)) {
			showError(phoneInput, 'Введите номер телефона.');
			showInputError(phoneInput);
		} else if (!isPhoneValid(phone)) {
			showError(phoneInput, 'Введите правильный номер.');
			showInputError(phoneInput);
		} else {
			showSuccess(phoneInput);
			removeInputError(phoneInput);
			valid = true;
		}
		return valid;
	};

	const checkCheckBox = () => {
		let valid = false;
		if (checkboxInput.checked === false) {
			showError(checkboxInput, 'Подтвердите согласие.');
		} else {
			showSuccess(checkboxInput);
			valid = true;
		}
		return valid;
	};

	const isPhoneValid = (phone) => {
		const re =
			/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
		return re.test(phone);
	};

	const isRequired = (value) => (value === '' ? false : true);
	const isBetween = (length, min, max) => (length < min || length > max ? false : true);

	const showError = (input, message) => {
		// get the form-field element
		const formField = input.parentElement;
		// add the error class
		formField.classList.remove('success');
		formField.classList.add('error');

		// show the error message
		const error = formField.querySelector('small');
		error.textContent = message;
	};

	const showSuccess = (input) => {
		// get the form-field element
		const formField = input.parentElement;

		// remove the error class
		formField.classList.remove('error');
		formField.classList.add('success');

		// hide the error message
		const error = formField.querySelector('small');
		error.textContent = '';
	};

	const showInputError = (input) => {
		input.classList.add('input-error');
	};
	const removeInputError = (input) => {
		input.classList.remove('input-error');
	};

	const sendForm = async (formData) => {
		const url = '/path/to/server/';
		const response = await fetch(url, {
			method: 'POST',
			body: formData,
		});
		console.log(response);
		if (!response.ok) {
			throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
		}
		return await response.text();
	};

	form.addEventListener('submit', function (e) {
		// prevent the form from submitting
		e.preventDefault();
		// create formData
		const formData = new FormData(this);

		// validate fields
		let isUsernameValid = checkUsername(),
			isPhoneValid = checkUserPhone();
		isCheckboxValid = checkCheckBox();

		let isFormValid = isUsernameValid && isPhoneValid && isCheckboxValid;

		// submit to the server if the form is valid
		if (isFormValid) {
			sendForm(formData)
				.then((response) => {
					console.log(response);
					form.reset();
				})
				.catch((err) => {
					console.error(err);
					alert('Что-то пошло не так, попробуйте еще раз');
					form.reset();
				});
		}
	});

	const debounce = (fn, delay = 500) => {
		let timeoutId;
		return (...args) => {
			// cancel the previous timer
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			// setup a new timer
			timeoutId = setTimeout(() => {
				fn.apply(null, args);
			}, delay);
		};
	};

	// listeners
	nameInput.addEventListener(
		'input',
		debounce(function (e) {
			checkUsername();
		}),
	);

	phoneInput.addEventListener(
		'input',
		debounce(function (e) {
			checkUserPhone();
		}),
	);
});
