/**
 * Created by andy on 2016/6/9.
 */
;(function($){

    var Validator = function(form,setting,callBack){
        /**
         * 合并参数
         */
        $.extend(Validator.setting,setting);

        /**
         * 表单验证
         */
        this.validator(form,callBack);

        /**
         * 表单提交前是否再一次验证
         */
        this.submit(form,callBack);
    };

    /**
     *
     * 这边定义一些内部验证规则，有新的定义规则可以在rules中精进行扩充
     */
    Validator.rules = {
        int:/^\d+$/,
        float:/^\d+(\.\d+)?$/,
        money:/^\d+(\.\d{1,2})?$/,
        ip:"/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/",
        required:/^.+$/
    }

    Validator.msg = {
        int:"请输入整数",
        float:"请输入小数",
        money:"金额格式不正确",
        ip:"ip格式不正确",
        required:"不能为空"
    };

    /**
     * 这边定义一些常量
     */
    Validator.VALIDATOR = "validator";
    Validator.RULE = "rule";
    Validator.MSG = "msg";
    Validator.REGEXP = "regexp";
    Validator.URL = "validator-url";


    /**
     * 表单默认配置项
     */
    Validator.setting = {
        onSubmit:true,//表单提交前是否再次验证表单 true or false
        immediately:true//什么时候验证输入域 keyup or click or focus or blur
    }

    Validator.prototype = {
        //获取需要校验的输入域
        getValidatorFields:function(form){
            var inputs = form.find("input"),
                selects = form.find("select");
            var validField = [];
            inputs.each(function(index,item){
                var value = $(this).attr("validator");
                if(value != "undefined"){
                    if(value == "true"){
                        validField.push($(this));
                    }
                }
            });
            selects.each(function(index,item){
                var value = $(this).attr("validator");
                if(value != "undefined"){
                    if(value == "true"){
                        validField.push($(this));
                    }
                }
            });
            return validField;
        },
        validatorField:function(field){
            /**
             *  验证规则的顺序：
             *      1.先验证内部规则
             *      2.然后在验证自定义规则
             *      3.然后再执行异步验证
             */
            var rules = field.attr(Validator.RULE) != "undefined"?$.trim(field.attr(Validator.RULE)):"",
                ruleArr = rules != ""?rules.split(/\s+/):[],
                errorMsg = [],
                regexp;

            /**
             *  1.验证内部验证规则
             */
            for(var i = 0 ; i < ruleArr.length; i++){
                if(Validator.rules[ruleArr[i]] != ""){
                        regexp = Validator.rules[ruleArr[i]];
                    if(!regexp.test(field.val())){
                        errorMsg.push(Validator.msg[ruleArr[i]]);
                    }
                }
            }

            /**
             * 2.验证自定义规则
             */
            if(field.attr(Validator.REGEXP) != undefined){
                regexp = $.trim(field.attr(Validator.REGEXP));
                var pat =  new RegExp(regexp);
                if(!pat.test(field.val())){
                    errorMsg.push(field.attr(Validator.MSG));
                }
            }

            /**
             * 3.异步验证
             */
            var that  = field;
            if(field.attr(Validator.URL) != undefined){
                $.ajax({
                    type: "POST",
                    url: Validator.URL,
                    data: that.val(),
                    dataType: "text",
                    success: function(msg){
                        if(msg.length > 0){
                            errorMsg.push(msg);
                        }
                    }
                });
            }
            return errorMsg;
        },
        validator:function(form,callBack){
            var that = this,
                validatorFields = this.getValidatorFields(form);
            for(var i = 0 ; i < validatorFields.length ; i++){
                var field = validatorFields[i];
                field.on({
                    click:function(){
                      if(Validator.setting.immediately){
                          that.validatorField_($(this),callBack);
                      }
                    },
                    focus:function(){
                        if(Validator.setting.immediately){
                            that.validatorField_($(this),callBack);
                        }
                    },
                    blur:function(){
                        if(Validator.setting.immediately){
                            that.validatorField_($(this),callBack);
                        }else{
                            that.validatorField_($(this),callBack);
                        }
                    },
                    keyup:function(){
                        if(Validator.setting.immediately){
                            that.validatorField_($(this),callBack);
                        }
                    },
                    change:function(){
                        if(Validator.setting.immediately){
                            that.validatorField_($(this),callBack);
                        }
                    }
                })
            }
        },
        validatorField_:function(field,callBack){
            var msg =  this.validatorField(field);
            if(msg.length > 0 ){
                callBack(field,msg);
            }
        },
        submit:function(form,callBack){
            var sub = form.find('[type = "submit"]'),
                that = this;
            sub.on("click",function(){
                if(Validator.setting.onSubmit){
                    var validatorFields = that.getValidatorFields(form);
                    for(var i = 0 ; i < validatorFields.length ; i++){
                        var field = validatorFields[i];
                        var msg =  that.validatorField(field);
                        if(msg.length > 0 ){
                            callBack(field,msg);
                        }
                    }
                }
            });
        }
    }

    Validator.init = function(forms,setting,callBack){
        forms.each(function(index,item){
           new Validator($(this),setting,callBack);
        });
    }
    window["Validator"] = Validator;
})(jQuery);