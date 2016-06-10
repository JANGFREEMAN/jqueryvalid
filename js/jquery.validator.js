/**
 * Created by andy on 2016/6/9.
 */
;(function($){

    var Validator = function(form,callBack){
        this.validator(form,callBack);
    };

    Validator.rules = {
        int:/^\d+$/,
        float:/^\d+\.\d{2}$/,
        money:"1",
        tel:"1"
    }

    Validator.msg = {
        int:"请输入整数",
        float:"请输入小数",
        money:"金额",
        tel:"电话号码格式不正确"
    }

    Validator.prototype = {
        getValidatorInputs:function(form){
            var inputs = form.find("input");
            var validInput = [];
            inputs.each(function(index,item){
                var value = $(this).attr("validator");
                if(value.length > 0){
                    if(value == "true"){
                        validInput.push($(this));
                    }
                }
            });
            return validInput;
        },
        validatorInput:function(input){
            var rules = input.attr("rule"),
                ruleArr = rules.split(/\s+/),
                errorMsg = [];
            for(i = 0 ; i < ruleArr.length; i++){
                if(Validator.rules[ruleArr[i]] != ""){
                    var regex = Validator.rules[ruleArr[i]],
                        val = input.val();
                    if(!regex.test(val)){
                        errorMsg.push(Validator.msg[ruleArr[i]]);
                    }
                }
            }
            return errorMsg;
        },
        validator:function(form,callBack){
            var that = this,
                validatorInputs = this.getValidatorInputs(form);
            for(i = 0 ; i < validatorInputs.length ; i++){
                var validatorInput = validatorInputs[i];
                validatorInput.on("keyup",function(){
                    msg =  that.validatorInput($(this));
                    if(msg.length >0 ){
                        callBack(validatorInput,msg);
                    }
                });
            }
        }

    }

    Validator.init = function(forms,callBack){
        forms.each(function(index,item){
           new Validator($(this),callBack);
        });
    }

    window["Validator"] = Validator;
})(jQuery);