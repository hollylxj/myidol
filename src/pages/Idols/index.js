import React from 'react';
import getWeb3 from '../../utils/getWeb3'

import MyIdolContract from '../../../node_modules/myidol/build/contracts/MyIdol.json'


import {Modal, Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail, Tooltip, OverlayTrigger} from 'react-bootstrap';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-120547267-1');
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.ga('send', 'pageview', '/');

export default class Idols extends React.Component {
    constructor(props) {
       super(props)

       this.state = {
         admin: false,
         isHover: [false]*100,
         show:false,
         with_eth:true
       }
    }

    instantiateContract() {
        self= this;
        /*
         * SMART CONTRACT EXAMPLE
         *
         * Normally these functions would be called in the context of a
         * state management library, but for convenience I've placed them here.
         */

        const contract = require('truffle-contract')

        //Extract contract ABI
        const myIdol = contract(MyIdolContract);

        //Set Web3 Providers
        myIdol.setProvider(self.state.web3.currentProvider);

        myIdol.deployed().then(async (instance) => {
            console.log("Successfully deployed MyIdol");
            // this.setState({ChanCoreContract : instance});
            self.MyIdolContract = await instance;
        }).then(() => {
            var idols = [];
            self.MyIdolContract.totalSupply().then(numOfIdols => {
                for(var i = 1; i <= numOfIdols; i++){
                    (function(id, web3){
                        const idol = {};
                        self.MyIdolContract.getIdol(id).then(idolData => {
                            idol.id = id;
                            idol.name = idolData[0];
                            idol.ownerName = idolData[1];
                            idol.ownerAddress = idolData[2];
                            idol.value = web3.fromWei(idolData[3].toNumber(), "finney");
                            idol.sellPrice = web3.fromWei(idolData[4].toNumber(), "finney");
                            idols.push(idol);
                        }).then( () => {
                            console.log(idol);
                            self.setState({fake_data:self.state.fake_data.concat([idol])});
                            self.state.fake_data.sort(function(a, b){
                            var keyA = a.value;
                            var keyB = b.value;
                            // Compare the 2 dates
                            if(keyA < keyB) return 1;
                            if(keyA > keyB) return -1;
                            return 0;
                        });




                        });

                    })(i, this.state.web3);    
                }
            });
        }).catch(()=>{
          this.setState({with_eth:true});
          alert('请确认您在以太坊主网络上, 请登录metamask.io下载metamask, 并选择Main Ethereum');
        })
    }


    buy(idol_id){
      self=this;
      console.log(this.state.ownerName);
      if(!this.state.ownerName){
        alert("名字不能为空");
        return ;
      }
        console.log(idol_id);
        self = this;
        var ownerName = "Owner Name"; //temporary

        this.MyIdolContract.getIdol(idol_id).then(idolData => {
          console.log(idolData);
          const priceInWei = idolData[4].toNumber();
          console.log("Price:"+this.state.web3.fromWei(priceInWei, "finney")+" (milliETH)");
          this.MyIdolContract.buyIdol.sendTransaction(idol_id, self.state.ownerName, {
            from:this.state.account,
            to:this.MyIdolContract.address,
            value:priceInWei,
            gas:1000000
          }).then(result => {
            // alert("successful, you may need to wait for a while before you can see the update. It may fail because of concurrent transactions. The name of the buyer who win the bid will be shown. Transaction takes about 15 seconds to finish. Please refresh later.");
            //refresh page
            alert("交易成功提交！请等待交易完成后，重新刷新页面。如果其他用户手速比您更快，可能导致交易失败。")
          }).catch(()=>{
            alert("交易失败");
          })
        });
    }

    
    // initialize(){
    componentWillMount() {
        const self=this;

this.setState({fake_data:[]});
        getWeb3
        .then(async results => {
          await this.setState({
            web3: results.web3
          });
          // Get accounts.
          results.web3.eth.getAccounts((error, accounts) => {
            this.setState({account:accounts[0]});
          });        
        }).then(()=>{
          this.instantiateContract();
        }).catch(()=>{
          alert("以太网连接错误");
          self.setState({with_eth:'false'});
          console.log(self.state.with_eth);
        })

      



    }


      handleNameChange(event){
    console.log(event.target.value);
    this.setState({ownerName: event.target.value});
  }




  handleClose() {
    this.setState({ show: false });
  }



  handleShow() {
    this.setState({ show: true });
  }

  mouseOver(i) {
    return () => {
      if (this.state.isHover[i] === true) {
        return this.state;
      }
      let isHover = [...this.state.isHover]
      isHover[i] = true;
      this.setState({ ...this.state, isHover });
    }
  }

  mouseExit() {
    if (this.state.isHover === false) {
      return this.state;
    }
    this.setState({ ...this.state, isHover: false });
  }



  render() {
    const buy_func = this.buy.bind(this);
    const account = this.state.account;

    const tstyle={
      'box-shadow':'0px 0px 10px #000',
      'height':'610px',
    }

     const bstyle={
        'background-color':'pink',
        'text-align': 'center',
        'display': 'inline-block',
        'margin-left': 'auto',
        'margin-right': 'auto',
      };

    const tooltiptext = {
      'width': '120px',
      'top': '100%',
      'left': '50%',
      'margin-left': '-60px',
    }

    const bodystyleouter = {
      'width': '100%'
    }

    const centerbuttonouter = {
      'width': '100%',
      'text-align': 'center',
    }

    const bodystyle = {
      'display': 'inline-block',
      'text-align': 'left',
      'margin-left': 'auto',
      'margin-right': 'auto',
    }


        let jstyle={
      'background-color':"pink"
    }

    let istyle={
      'width':'100px',
      'height':'100px'
    }

    self=this;

    function tociclednumber(num) {
      if (num < 0 || num > 50) {
        return num
      }
      return '⓪ ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑯ ⑰ ⑱ ⑲ ⑳ ㉑ ㉒ ㉓ ㉔ ㉕ ㉖ ㉗ ㉘ ㉙ ㉚ ㉛ ㉜ ㉝ ㉞ ㉟ ㊱ ㊲ ㊳ ㊴ ㊵ ㊶ ㊷ ㊸ ㊹ ㊺ ㊻ ㊼ ㊽ ㊾ ㊿'.split(' ')[num]
    }

    function computeowner(ownername) {
      if (ownername == null || ownername === '') {
        return <b>未创始</b>
      }
      return <span><b>独家创始人:</b> {ownername}</span>
    }



    let with_eth_display= (
      <div>
                      <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>玩法说明</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <h3>游戏规则</h3>
                    <p><strong>偶像的身价是怎样计算的？</strong></p><p>每次被Pick，身价自动上涨1.2倍。每位偶像的起始身价为1mEH(约人民币2元，须以以太币当日价格为准)。</p>
                    <p><strong>怎样成为创始人？</strong></p><p>付出与偶像身价等价的以太币，则可以拥有独家创始人身份。</p>
                    <p><strong>如果创始人身份被抢，我该怎么办？</strong></p><p>您之前付出的金额会被全部退还，同时，您会收获偶像身价的10%作为奖励。</p>
                    <h3>为什么使用区块链？</h3>
                    <p><strong>什么是区块链？</strong></p><p>区块链技术是一种分布式储存并防止篡改数据的技术，分布在全球数以万计的储存和纠错节点为区块链提供计算支持，个别节点下线不影响整体区块链网络的持续运行，保证创始人身份储存在区块链上永久且无法篡改。
                    区块链还具有去中心化特征，节点之间互相平等，不存在任何中心。因此智能合约生成之后，没有中心机构能够进行幕后操作，篡改偶像身价。</p>
                    <p><strong>为什么应用区块链在这种场景？</strong><p>您的创始人身份将被永远记录在区块链上，无法篡改，永久生效。同时，偶像的身价仅由观众决定，实现真正去中心化的人气评级。</p></p>
                    <p><strong>可查询智能合约地址</strong><p>0x3eeb39bb0e0642fcbbd41c3fbb67c6108369d573</p></p>
                    <h3>使用方法</h3>
                    <p>请您安装<a href="https://metamask.io">MetaMask</a>钱包插件，并连接以太主网络，只要钱包中有足够的以太币，即可进行交易。</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose.bind(this)}>关闭</Button>
                    </Modal.Footer>
                </Modal>

        <div>
          <Grid>
            <Row>
              {this.state.fake_data.map(function(d, idx){
                const tooltip = (
                  <Tooltip id="tooltip">
                    <strong>地址:</strong> {d.ownerAddress}
                  </Tooltip>
                );
                return (<Col xs={6} md={4}>
                  <Thumbnail src={require("../../101/"+d.id+".png")} alt="Image not available" style={tstyle}>
                  <h3><b>{tociclednumber(idx+1)}</b> {d.name}</h3>
                  <div style={bodystyleouter}>
                  <div style={bodystyle}>
                  
                  <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <p>{computeowner(d.ownerName)}</p>
                  </OverlayTrigger>
                  <p><b>身价</b> {d.sellPrice} mETH</p>
                  <p>
                    <input placeholder="创始人名字" id="myname" type="text" onChange={self.handleNameChange.bind(self)}></input>
                  </p>

                  <div style={centerbuttonouter}>
                      <Button style={bstyle} onClick={buy_func.bind(null,d.id)}>
                          Pick Me Up!
                      </Button>
                  </div>

                  </div>
                  </div>
                  </Thumbnail>
                </Col>)
              })}
            </Row>
          </Grid>
        </div>
              <div style={{'position': 'fixed','z-index':-1, 
'height': '100px',
'width': '100px',
'bottom': '90px',
'right': '50px'}}>
            <Button style={{'box-shadow':'0px 0px 10px #000','width':'100px','height':'100px','background-color':'white','border-radius':'50%'}} onClick={this.handleShow.bind(this)} >玩法说明</Button>
            </div>




            <Jumbotron style={jstyle}>

            </Jumbotron>
      </div>
    );

    let without_eth_display=<p>Alice</p>;
    return self.state.with_eth?with_eth_display:without_eth_display;


  }
}
