import React, {Component} from 'react'
import { Form, Input, Radio,Row,Col,Select, Button} from 'antd'
const {Search} = Input
import moment from 'moment'


const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class FieldsContent extends Component {

	constructor(props) {

		super(props);
    }

	render() {

        const {InputChangeHandle,fieldsArr,spanNum,fieldsValue} =this.props.fieldsConfig;

        let content = [];

        fieldsArr.forEach((item,idx)=>{

            switch (item.type){
                case 'input' :
                    content.push(
                        <Col span={spanNum} key={idx}>
                            <FormItem 
                                label={item.label} 
                                colon= {true} 
                                validateStatus={item.validateStatus}
                                help={item.help || ''}
                                hasFeedback={item.hasFeedback || false}
                            >
                                <Input 
                                    placeholder={item.placeholder} 
                                    value ={fieldsValue[item.key]} 
                                    maxLength= {item.maxlength || 100000}
                                    onChange={InputChangeHandle.bind(this,item.key)}
                                    disabled={item.disabled || false} 
                                />
                            </FormItem>

                        </Col>
                    )

                    break;

                case 'memberInput' :
                    content.push(
                        <Col span={spanNum} key={idx}>
                            <FormItem 
                                label={item.label} 
                                colon= {true} 
                                validateStatus={item.validateStatus}
                                help={item.help || ''}
                                hasFeedback={item.hasFeedback || false}
                            >
                                <Search
                                    placeholder={item.placeholder} 
                                    value ={fieldsValue[item.key]} 
                                    maxLength= {item.maxlength || 100000}
                                    disabled={item.disabled || false} 
                                    enterButton="Delete"
                                    onChange={InputChangeHandle.bind(this,item.key)}
                                    onSearch={InputChangeHandle.bind(this,item.key)}
                                />
                            </FormItem>
                            
                        </Col>
                    )

                    break;

                case 'select' :
                    let optionContent = item.options.map((optData,opIdx)=>{
                        return <Option key={opIdx} value={optData.value} >{optData.desc}</Option>
                    });
                    let mode = item.mode || '';
                    let value = fieldsValue[item.key] || 'defaultValue';

                    if(mode == 'multiple' && (value== '' || value == 'defaultValue') ){
                        value = [];
                    }


                    const selectContent = (
                         <Select mode={mode} disabled={item.disabled || false} value={value} style={{ width: 200 }} onChange={InputChangeHandle.bind(this,item.key)}>
                            {optionContent}
                         </Select>
                    )

                    content.push(
                        <Col span={spanNum} key={idx}>
                            <FormItem 
                                label={item.label} 
                                colon= {true} 
                                validateStatus={item.validateStatus}
                                help={item.errtip || ''}
                                hasFeedback={item.hasFeedback || false}
                            >
                                {selectContent}
                            </FormItem>
                        </Col>
                    )
                    break;

                case 'button': {
                    content.push(
                        <Col span={spanNum} key={idx}>
                            <div key={idx}>
                                <Button type="primary" size="small" onClick={InputChangeHandle.bind(this, item.key)}>{item.label}</Button>
                            </div>
                        </Col>
                    )
                }
            }

        })

        const fieldContent = (
            <span>
                <Row gutter={24}>
                    {content}
                </Row>
            </span>
        )

        return fieldContent;
	}

}

export default FieldsContent;