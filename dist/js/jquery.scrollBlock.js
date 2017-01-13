/*
 * jQuery.scrollBlock plugin by Rasy 0.1.0
 * https://github.com/rasy-js
 *
 * Author: Rasy
 * Email: rasy.js@gmail.com
 * Website: /
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function ( $, window, undefined ) {

  'use strict';

  var pluginName = 'scrollBlock',
      document = window.document,
      defaults = {
        blockWidth: undefined, // ширина блока
        blockHeight: undefined, // высота блока
        pointFixed: 100, // величина для фиксирования, если ноль то считается высота элемента и отступ от начала страницы
        top: 0, // отступ от начала страницы
        query: 840, // брейкпоинт для инитиализации
        viewportWidth: undefined, // ширина вьюпорта
        viewportHeight: undefined, // высота вьюпорта
        windowScroll: 0, // величина отступа скролла при прокрутке
        paddingBottom: 0, // отступ снизу если высота вьюпорта больше чем высота элемента
        callback: function() {} // колбэк когда блок зафиксирован
      };

  function Plugin( element, options ) {
    this.element = element;

    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {

    init: function() {
      this.log();
      this.setBlockSize(this.element, this.options);
      this.setPointFixed(this.element, this.options);
      this.getWindowWidth(this.options);
      this.getWindowHeight(this.options);
      this.addPaddingElement(this.element, this.options);
      this.onWindowEvents(this.element, this.options);
      this.fixElement(this.element, this.options);
    },

    getWindowWidth: function(options) {
      options.viewportWidth = window.innerWidth || document.body.clientWidth;
      return window.innerWidth || document.body.clientWidth;
    },

    getWindowHeight: function(options) {
      options.viewportHeight = window.innerHeight || document.body.clientHeight;
      return window.innerHeight || document.body.clientHeight;
    },

    onWindowEvents: function(el, options) {
      var _self = this;

      $(window)
        .on('resize', function(event) {
          var w = _self.getWindowWidth(el, options);
          var h = _self.getWindowHeight(el, options);
          options.viewportWidth = w;
          options.viewportHeight = h;
          _self.addPaddingElement(el, options);
          _self.fixElement(el, options);
        })
        .on('scroll', function(event) {
          options.windowScroll = $(this).scrollTop();
          _self.fixElement(el, options);
        });
    },

    addPaddingElement: function(el, options) {
      if (options.viewportHeight > options.blockHeight) return;
      var subtraction = options.blockHeight - options.viewportHeight;
      options.paddingBottom = subtraction + 100;
    },

    fixElement: function(el, options) {
      if (options.viewportWidth < options.query || options.windowScroll < options.pointFixed) {
        $(el).removeAttr('style');
        return;
      }

      $(el).css({
        'overflow': 'auto',
        'position': 'fixed',
        'top': options.top || 0,
        'width': options.blockWidth,
        'height': options.blockHeight
      });

      $(el).children().css('padding-bottom', options.paddingBottom);

      if ($.isFunction(options.callback)) {
        options.callback();
      }
    },

    setBlockSize: function(el, options) {
      if (!options.blockWidth) options.blockWidth = $(el).width();
      if (!options.blockHeight) options.blockHeight = ($(el).height() - 100);
    },

    setPointFixed: function(el, options) {
      if (!options.pointFixed) {
        options.pointFixed = $(el).height() + $(el).offset().top;
      }
    },

    log: function(msg) {
      console.clear();
      // console.log(msg);
    }

  };

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  };

}(jQuery, window));