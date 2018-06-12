import React from 'react';
import getWeb3 from '../../utils/getWeb3'

import MyIdolContract from '../../../node_modules/myidol/build/contracts/MyIdol.json'
import translator from '../../utils/translator'

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
          alert(translator.translate('ALERT_text'));
        })
    }


    buy(idol_id){
      self=this;
      console.log(this.state.ownerName);
      if(!this.state.ownerName){
        alert(translator.translate('IDOL_nameEmptyError'));
        return ;
      }
        console.log(idol_id);
        self = this;

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
            alert(translator.translate('IDOL_transactionSubmitted'))
          }).catch(()=>{
            alert(translator.translate('IDOL_transactionError'));
          })
        });
    }

    
    // initialize(){
    componentWillMount() {
        const self=this;
        const { match, lang } = this.props;
        translator.setLocale(lang);

        this.setState({fake_data:[]});
        getWeb3.then(async results => {
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
          alert(translator.translate('IDOL_connectionError'));
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
      return <span><b>{translator.translate('IDOL_ownerNameLabel')}:</b> {ownername}</span>
    }



    let with_eth_display= (
      <div>
          <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
              <Modal.Header closeButton>
                  <Modal.Title>{translator.translate('INSTRUCTIONS_header')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <h3>{translator.translate('INSTRUCTIONS_section1Header')}</h3>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question1')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section1Answer1')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question2')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section1Answer2')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question3')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section1Answer3')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question4')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section1Answer4')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question5')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section1Answer5')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question6')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section1Answer6')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question7')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section1Answer7')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section1Question8')}</strong></p>
              <ol>
                <li>
                  {translator.translate('INSTRUCTIONS_section1Answer8_1')}
                  <a href={translator.translate('INSTRUCTIONS_section1Answer8_1_link')}>{translator.translate('INSTRUCTIONS_section1Answer8_1_link')}</a>
                </li>
                <li>{translator.translate('INSTRUCTIONS_section1Answer8_2')}</li>
                <li>
                  {translator.translate('INSTRUCTIONS_section1Answer8_3_1')}
                  <br/>
                  {translator.translate('INSTRUCTIONS_section1Answer8_3_2')}
                  <a href={translator.translate('INSTRUCTIONS_section1Answer8_3_link')}>{translator.translate('INSTRUCTIONS_section1Answer8_3_link')}</a>
                  <br/>
                  {translator.translate('INSTRUCTIONS_section1Answer8_3_3')}
                </li>
                <li>{translator.translate('INSTRUCTIONS_section1Answer8_4')}</li>
              </ol>
              <h3>{translator.translate('INSTRUCTIONS_section2Header')}</h3>
              <p><strong>{translator.translate('INSTRUCTIONS_section2Question1')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section2Answer1')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section2Question2')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section2Answer2')}</p>
              <p><strong>{translator.translate('INSTRUCTIONS_section2Question3')}</strong></p>
              <p>{translator.translate('INSTRUCTIONS_section2Answer3')}</p>
              <h3>{translator.translate('INSTRUCTIONS_section3Header')}</h3>
              <p>{translator.translate('INSTRUCTIONS_section3Content1')}<a href="https://metamask.io">MetaMask</a>{translator.translate('INSTRUCTIONS_section3Content2')}</p>
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.handleClose.bind(this)}>{translator.translate('INSTRUCTIONS_close')}</Button>
              </Modal.Footer>
          </Modal>

        <div>
          <Grid>
            <Row>
              {this.state.fake_data.map(function(d, idx){
                const tooltip = (
                  <Tooltip id="tooltip">
                    <strong>translator.translate('IDOL_ownerAddressLabel'):</strong> {d.ownerAddress}
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
                  <p><b>{translator.translate('IDOL_valueLabel')}</b> {d.sellPrice} mETH</p>
                  <p>
                    <input placeholder={translator.translate('IDOL_buyerNamePlaceholder')} id="myname" type="text" onChange={self.handleNameChange.bind(self)}></input>
                  </p>

                  <div style={centerbuttonouter}>
                      <Button style={bstyle} onClick={buy_func.bind(null,d.id)}>
                          {translator.translate('IDOL_buyButton')}
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
            <Button style={{'box-shadow':'0px 0px 10px #000','width':'100px','height':'100px','background-color':'white','border-radius':'50%'}} onClick={this.handleShow.bind(this)} >{translator.translate('BUTTON_label')}</Button>
        </div>




        <Jumbotron style={jstyle}>

        </Jumbotron>
      </div>
    );

    let without_eth_display=<p>Alice</p>;
    return self.state.with_eth?with_eth_display:without_eth_display;


  }
}
