import React, {Component} from 'react'
// import {Toast} from 'antd-mobile'
import style from './BindPhone.module.css'

import {kitchen} from '../../utils';

import {connect} from 'react-redux';

import {actions} from '../User/store';

import logo from "../../static/images/binding_logo.png"
import country from "../../static/images/binding_phone.png"
import btn_close from "../../static/images/btn_close.png"

class BindPhone extends Component {

  handlePhoneChange = (event) => {
    const phone = event.target.value;

    console.log("手机输入完毕: ", event.target.value);
    const re = /\d*$/;

    if (re.test(phone)) {
      this.setState({phone});
      if (/^1\d{10}$/.test(phone)) {
        console.log('格式正确');
      }
    }
  };
  handleCodeChange = (event) => {
    const code = event.target.value;
    if (/\d*/.test(code)) {
      this.setState({code});
    }
  };
  handleCodeSend = () => {

    const {phone} = this.state;

    if (/^1\d{10}$/.test(phone)) {
      kitchen.sendPhoneCode(phone).then(result => {
        console.log(result);

        if (result === 'ok') {
          this.setState({
            status: 'sent',
            resend: 'sending',
            bind: phone,
            delay: 60
          });

          this.resend = setInterval(() => {
            let {delay} = this.state;
            --delay;

            if (delay > 0) {
              this.setState({
                resend: 'sending',
                delay
              })
            } else {
              this.setState({
                resend: 'init',
                delay: 0,
              });
              clearInterval(this.resend)
            }
          }, 1000);
        }
      })
    } else {
      console.log('手机格式不符');
    }
  };
  handleRegister = () => {
    const {phone, code, status} = this.state;
    if (status === 'sent' && /^1\d{10}$/.test(phone) && /\d{6}$/.test(code)) {
      kitchen.bindPhone(phone, code).then(result => {
        if (result === 'ok') {
          kitchen.getUserInfo().then(data => {
            this.props.updateUserInfo(data);
          }).then(this.props.history.replace('/front/address'))
        }
      });
    }
  };
  handleDialogShow = () => {
    this.setState({
      dialog: true
    })
  };
  handleDialogClose = () => {
    this.setState({
      dialog: false
    })
  };

  constructor() {
    super();

    this.state = {
      code: '',
      status: 'init',
      phone: '',
      dialog: false,
      resend: 'init',
      delay: 0,
    }
  }

  componentWillUnmount() {
    clearInterval(this.resend);
  }

  render() {

    const {phone, code, delay} = this.state;

    return (
      <div className={style.box}>
        <img src={logo} alt="" className={style.logo}/>

        <div className={style.phone_wrapper}>
          <span>中国<img src={country} alt=""/></span>
          <input type="text" placeholder="请输入手机号" value={phone} onChange={this.handlePhoneChange}/>
        </div>
        <p className={style.line}/>

        <div className={style.code_wrapper}>
          <input type="text" placeholder="点击输入验证码" value={code} onChange={this.handleCodeChange}/>
          {this.state.resend === 'sending' ?
            <button className={style.disable} disabled={true}>{delay}s后重发</button> :
            <button onClick={this.handleCodeSend}>获取验证码</button>
          }
        </div>

        <p className={style.line}/>

        <p className={style.clause_wrapper}>
          点击确定，即表示已阅读并同意《<span onClick={this.handleDialogShow}>注册会员服务条款</span>》
        </p>

        <button onClick={this.handleRegister} className={style.btn_wrapper}>确定</button>
        {this.state.dialog ?
          <div className={style.note}>
            <div className={style.center}>
              <div className={style.title}>用户服务协议</div>
              <div>
                <h4>一、特别提示</h4>
                <p>在此特别提醒您（用户）在注册成为宴十三用户之前，请认真阅读本《宴十三用户服务协议》（以下简称“协议”），
                  确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。您同意并点击确认本协议条款且完成注册程序后，
                  才能成为宴十三的正式注册用户，并享受宴十三的各类服务。您的注册、登录、使用等行为将视为对本协议的接受，
                  并同意接受本协议各项条款的约束。若您不同意本协议，或对本协议中的条款存在任何疑问，请您立即停止宴十三用户注册程序，
                  并可以选择不使用本网站服务。
                </p>
                <p>本协议约定宴十三与用户之间关于“宴十三”服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人、单位。
                  本协议可由宴十三随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本APP中查阅最新版协议条款。
                  在修改协议条款后，如果用户不接受修改后的条款，请立即停止使用宴十三提供的服务，
                  用户继续使用宴十三提供的服务将被视为接受修改后的协议。
                </p>
                <h4>二、账号注册</h4>
                <p>1、用户在使用本服务前需要注册一个“宴十三”账号。“宴十三”账号应当使用手机号码绑定注册，请用户使用尚未与“宴十三”账号绑定的手机号码，以及未被***根据本协议封禁的手机号码注册“宴十三”账号。宴十三可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，而无须事先通知用户。</p>
                <p>2、如果注册申请者有被宴十三封禁的先例或涉嫌虚假注册及滥用他人名义注册，及其他不能得到许可的理由，宴十三将拒绝其注册申请。</p>
                <p>3、鉴于“宴十三”账号的绑定注册方式，您同意宴十三在注册时将允许您的手机号码及手机设备识别码等信息用于注册。</p>
                <p>4、在用户注册及使用本服务时，宴十三需要搜集能识别用户身份的个人信息以便宴十三可以在必要时联系用户，或为用户提供更好的使用体验。宴十三搜集的信息包括但不限于用户的姓名、地址；宴十三同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。</p>
                <h4>三、账户安全</h4>
                <p>1、用户一旦注册成功，成为宴十三的用户，将得到一个用户名和密码，并有权利使用自己的用户名及密码随时登陆宴十三。</p>
                <p>2、用户对用户名和密码的安全负全部责任，同时对以其用户名进行的所有活动和事件负全责。</p>
                <p>3、用户不得以任何形式擅自转让或授权他人使用自己的宴十三用户名。</p>
                <p>4、用户对密码加以妥善保管，切勿将密码告知他人，因密码保管不善而造成的所有损失由用户自行承担。</p>
                <p>5、如果用户泄漏了密码，有可能导致不利的法律后果，因此不管任何原因导致用户的密码安全受到威胁，应该立即和宴十三客服人员取得联系，否则后果自负。</p>

                <h4>四、用户声明与保证</h4>
                <p>1、用户承诺其为具有完全民事行为能力的民事主体，且具有达成交易履行其义务的能力。</p>
                <p>2、用户有义务在注册时提供自己的真实资料，并保证诸如手机号码、姓名、所在地区等内容的有效性及安全性，保证宴十三工作人员可以通过上述联系方式与用户取得联系。同时，用户也有义务在相关资料实际变更时及时更新有关注册资料。</p>
                <p>3、用户通过使用宴十三的过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号头像、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复和相关链接页面，以及其他使用账号或本服务所产生的内容，不得违反国家相关法律制度，包含但不限于如下原则：
                  <li>（1）违反宪法所确定的基本原则的；</li>
                  <li>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
                  <li>（3）损害国家荣誉和利益的；</li>
                  <li>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</li>
                  <li>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
                  <li>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
                  <li>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
                  <li>（8）侮辱或者诽谤他人，侵害他人合法权益的；</li>
                  <li>（9）含有法律、行政法规禁止的其他内容的。</li>
                </p>
                <p>4、用户不得利用“宴十三”账号或本服务制作、上载、复制、发布、传播下干扰“宴十三”正常运营，以及侵犯其他用户或第三方合法权益的内容：
                  <li>（1）含有任何性或性暗示的；</li>
                  <li>（2）含有辱骂、恐吓、威胁内容的；</li>
                  <li>（3）含有骚扰、垃圾广告、恶意信息、诱骗信息的；</li>
                  <li>（4）涉及他人隐私、个人信息或资料的；</li>
                  <li>（5）侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</li>
                  <li>（6）含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。</li>
                </p>
                <h4>五、服务内容</h4>
                <p>1、宴十三是由北京今朝勇创科技有限公司提供的在线点餐交易平台，用户通过宴十三来实现在线点餐并完成交易，具体服务内容由宴十三根据实际情况提供，包括但不限于：
                  <li>（1）在线点餐服务；</li>
                  <li>（2）服务商收入结算和用户支付费用：具体金额以宴十三产生的统计数据为准。</li>
                  <li>（3）订单查询服务；</li>
                  <li>（4）配送到家服务;</li>
                </p>
                <p>2、宴十三有权随时审核或删除用户发布/传播的涉嫌违法或违反社会主义精神文明，或者被宴十三认为不妥当的内容（包括但不限于文字、语音、图片、视频、图文等）。</p>
                <p>3、所有发给用户的通告及其他消息都可通过APP或者用户所提供的联系方式发送。</p>
                <h4>六、服务的终止</h4>
                <p>1、在下列情况下，宴十三有权终止向用户提供服务：
                  <li>（1）在用户违反本服务协议相关规定时，宴十三有权终止向该用户提供服务；如该用户再一次直接或间接或以他人名义注册为用户的，一经发现，宴十三有权直接单方面终止向该用户提供服务；</li>
                  <li>（2）如宴十三通过用户提供的信息与用户联系时，发现用户在注册时填写的联系方式已不存在或无法接通，宴十三以其它联系方式通知用户更改，而用户在三个工作日内仍未能提供新的联系方式，宴十三有权终止向该用户提供服务；</li>
                  <li>（3）用户不得通过程序或人工方式进行刷量或作弊，若发现用户有作弊行为，宴十三将立即终止服务，并有权扣留账户内金额；</li>
                  <li>（4）一旦宴十三发现用户提供的数据或信息中含有虚假内容，宴十三有权随时终止向该用户提供服务；</li>
                  <li>（5）本服务条款终止或更新时，用户明示不愿接受新的服务条款；</li>
                  <li>（6）其它宴十三认为需终止服务的情况。</li>
                </p>
                <p>2、服务终止后，宴十三没有义务为用户保留原账号中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给用户或第三方。</p>
                <p>3、用户理解并同意，即便在本协议终止及用户的服务被终止后，宴十三仍有权：
                  <li>（1）继续保存您的用户信息；</li>
                  <li>（2）继续向用户主张在其使用宴十三平台服务期间因违反法律法规、本协议及平台规则而应承担的责任。</li>
                </p>
                <h4>七、服务的变更、中断</h4>
                <p>1、鉴于网络服务的特殊性，用户需同意宴十三会变更、中断部分或全部的网络服务，并删除（不再保存）用户在使用过程中提交的任何资料，而无需通知用户，也无需对任何用户或任何第三方承担任何责任。</p>
                <p>2、宴十三需要定期或不定期地对提供网络服务的平台进行检测或者更新，如因此类情况而造成网络服务在合理时间内的中断，宴十三无需为此承担任何责任。</p>
                <h4>八、服务条款修改</h4>
                <p>1、宴十三有权随时修改本服务条款的任何内容，一旦本服务条款的任何内容发生变动，宴十三将会通过适当方式向用户提示修改内容。</p>
                <p>2、如果不同意宴十三对本服务条款所做的修改，用户有权停止使用网络服务。</p>
                <p>3、如果用户继续使用网络服务，则视为用户接受宴十三对本服务条款所做的修改。</p>
                <h4>九、免责与赔偿声明</h4>
                <p>1、若宴十三已经明示其服务提供方式发生变更并提醒用户应当注意事项，用户未按要求操作所产生的一切后果由用户自行承担。</p>
                <p>2、用户明确同意其使用宴十三所存在的风险将完全由其自己承担，因其使用宴十三而产生的一切后果也由其自己承担。</p>
                <p>3、用户同意保障和维护宴十三及其他用户的利益，由于用户在使用宴十三有违法、不真实、不正当、侵犯第三方合法权益的行为，或用户违反本协议项下的任何条款而给宴十三及任何其他第三方造成损失，用户同意承担由此造成的损害赔偿责任。</p>
                <h4>十、隐私声明</h4>
                <p>1、适用范围：
                  <li>（1）在用户注册宴十三账户时，根据要求提供的个人注册信息；</li>
                  <li>（2）在用户使用宴十三，或访问其相关网页时，宴十三自动接收并记录的用户浏览器上的服务器数值，包括但不限于IP地址等数据及用户要求取用的网页记录。</li>
                </p>
                <p>2、信息使用：
                  <li>（1）宴十三不会向任何人出售或出借用户的个人信息，除非事先得到用户的许可；</li>
                  <li>（2）宴十三亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户的个人信息。任何用户如从事上述活动，一经发现，宴十三有权立即终止与该用户的服务协议，查封其账号；</li>
                  <li>（3）为达到服务用户的目的，宴十三可能通过使用用户的个人信息，向用户提供服务，包括但不限于向用户发出产品和服务信息，或者与宴十三合作伙伴共享信息以便他们向用户发送有关其产品和服务的信息。</li>
                </p>
                <p>3、信息披露：用户的个人信息将在下述情况下部分或全部被披露：
                  <li>（1）经用户同意，向第三方披露；</li>
                  <li>（2）根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</li>
                  <li>（3）如果用户出现违反中国有关法律或者网站政策的情况，需要向第三方披露；</li>
                  <li>（4）为提供用户所要求的产品和服务，而必须和第三方分享用户的个人信息；</li>
                  <li>（5）其它宴十三根据法律或者网站政策认为合适的披露；</li>
                  <li>（6）用户使用宴十三时提供的银行账户信息，宴十三将严格履行相关保密约定。</li>
                </p>
                <h4>十一、其他</h4>
                <p>1、宴十三郑重提醒用户注意本协议中免除宴十三责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。</p>
                <p>2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和宴十三之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交宴十三住所地有管辖权的人民法院管辖。</p>
                <p>3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。</p>
                <p>4、本协议最终解释权归宴十三有限公司所有，并且保留一切解释和修改的权力。</p>
                <p>5、本协议从2018年6月29日起适用。</p>
              </div>
            </div>
            <img id='close' src={btn_close} alt="" className={style.btn_close} onClick={this.handleDialogClose}/>
          </div> : null
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfo: (data) => dispatch(actions.updateUserInfo(data)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BindPhone);