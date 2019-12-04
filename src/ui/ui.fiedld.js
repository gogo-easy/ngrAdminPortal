import React, {Component} from 'react'
import { Form, Input, Radio,Row,Col,Select, TimePicker, Checkbox} from 'antd'
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
                            { item.key === 'group_context' && (
                                <Checkbox
                                    className='group_context_tip'
                                    checked={ fieldsValue[item.key] === '-default-' }
                                    onChange={ item.onChange }>缺省上下文</Checkbox>
                            ) }
                            { item.key === 'seq_num' && (
                                <label className='seq_num_css'>说明：值越小越优先</label>
                            ) }
                        </Col>
                    )

                    break;

                case 'switch' :

                    content.push(
                        <Col span={spanNum}  key={idx}>
                            <FormItem 
                                label={item.label} 
                                colon= {true} 
                                validateStatus={item.validateStatus}
                                help={item.errtip || ''}
                                hasFeedback={item.hasFeedback || false}
                            >

                                <RadioGroup onChange={InputChangeHandle.bind(this,item.key)} value={fieldsValue[item.key]} disabled={item.disabled || false} >
                                    <RadioButton value="1">启用</RadioButton>
                                    <RadioButton value="0">禁用</RadioButton>
                                </RadioGroup>
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
                case 'TimePicker': {
                    let endTimeUseful = null
                    if (fieldsValue['effect_s_time']) {
                        endTimeUseful = (fieldsValue['effect_s_time'].split(':').join('') - fieldsValue['effect_e_time'].split(':').join('')) > 0
                    }
                    
                    content.push(
                        <Col span={spanNum} className={ (+fieldsValue.rate_type !== 1 && 'none') || '' } key={idx}>
                            <FormItem
                                label={item.label}
                                colon= {true} 
                                validateStatus={item.validateStatus}
                                help={item.errtip || ''}
                                hasFeedback={item.hasFeedback || false}
                            >
                                <TimePicker
                                    defaultValue={moment(fieldsValue[item.key] || new Date(), 'HH:mm:ss')}
                                    onChange={InputChangeHandle.bind(this,item.key)} format='HH:mm:ss' />
                            </FormItem>
                            {
                                (item.key === 'effect_e_time') && endTimeUseful && (<span className='warn'>结束时间不可早于开始时间</span>)
                            }
                        </Col>
                    )
                    break;
                }
                case 'textArea': {
                    content.push(
                        <div key={idx}>
                            <div style={{ fontWeight: 'bold' }}>
                                { item.label }:
                                { (item.key === 'message') && item['disabled'] && (<span className='err_msg'>类型已选，内容必填</span>) }
                            </div>
                            <textarea
                                style={{ width: '100%', resize: 'none', height: '100px' }}
                                value={ fieldsValue[item.key] }
                                placeholder={item.placeholder}
                                onChange={InputChangeHandle.bind(this,item.key)} />
                        </div>
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