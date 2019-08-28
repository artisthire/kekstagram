import {ChangeImgEffect} from './change-img-effect.js';
import {BtnsRangeSwitch} from './btns-range-switch.js';
import {Popup} from './popup.js';

export class FormUploadImg {
  // TODO: Добавить обработчки изменения эффектов, наложенных на изобржение
  _popup;
  _scaler;
  _changerImgEffect;

  constructor(btnUploadFile) {
    this.btnUploadFile = btnUploadFile;

    this._modalOverlay = document.querySelector('.img-upload__overlay');
    this._modalContainer = this._modalOverlay.querySelector('.img-upload__wrapper');
    this._modalCloseBtn = this._modalContainer.querySelector('#upload-cancel');

    this._hashtagInput = this._modalContainer.querySelector('.text__hashtags');
    this._descriptionInput = this._modalContainer.querySelector('.text__description');
    this._imgElement = this._modalContainer.querySelector('.img-upload__preview > img');

    this._onBtnUploadFileChange = this._onBtnUploadFileChange.bind(this);
    this.btnUploadFile.addEventListener('change', this._onBtnUploadFileChange);
  }


  _onBtnUploadFileChange() {
    this._popup = new Popup(this._modalOverlay, this._modalContainer, [this._hashtagInput, this._descriptionInput], this._modalCloseBtn, 'hidden', 'modal-open');

    this._destroyForm = this._destroyForm.bind(this);
    this._popup.addClosePopupListener(this._destroyForm);
    this._popup.showPopup(this._initForm.bind(this));
  }

  _initForm() {
    let rangeSwitchContainer = document.querySelector('.scale');
    this._scaler = new BtnsRangeSwitch(
        {container: rangeSwitchContainer},
        {startValue: 100, valueStep: 25, minValue: 25, maxValue: 100});

    this._scaleImg = this._scaleImg.bind(this);
    this._scaler.addChangeListener(this._scaleImg);

    this._changerImgEffect = new ChangeImgEffect(this._imgElement);
  }

  _destroyForm() {
    this._scaler.removeChangeListener(this._scaleImg);
    this._scaler.destructor();
    this._scaler = null;

    this._popup.removeClosePopupListener(this._destroyForm);
    this._popup = null;

    this._changerImgEffect.destructor();
    this._changerImgEffect = null;

    // сбрасываем значение input[type='file'] для повторной сработки события 'change' если изображение будет тем же
    this.btnUploadFile.value = '';

    // сбрасываем содержимое полей хэштегов и описания изображения
    this._hashtagInput.value = '';
    this._descriptionInput.value = '';

    // сбрасываем примененные к изображению стили
    this._imgElement.style.transform = '';
  }

  _scaleImg(evt) {
    let scaleValue = evt.detail.value / 100;
    this._imgElement.style.transform = `scale(${scaleValue})`;
  }
}
