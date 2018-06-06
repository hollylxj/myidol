import React from 'react';
import getWeb3 from '../../utils/getWeb3'

import MyIdolContract from '../../../node_modules/myidol/build/contracts/MyIdol.json'

<<<<<<< HEAD
import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail, Tooltip, OverlayTrigger} from 'react-bootstrap';
=======
import {Badge, Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';
>>>>>>> 7a0217ffc7f375ea45cd22c6aea6b243c89e2e28

export default class Idols extends React.Component {
    constructor(props) {
       super(props)

       this.state = {
         admin: false,
         isHover: [false]*100
       }

       // this.initialize();

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
                            //idol.url = "https://s3.amazonaws.com/cryptochans/" + id + ".jpg";
                            // idol.url = "1.png";
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
            // self.setState({fake_data:idols});
            /*self.MyIdolContract.getIdols().then(idols => {
                console.log('Total Idols:', idols.length);

                idols.foreach(idol => {
                    console.log(idol);
                });

                // for(const i = 0; i < totalChans+1; i++){
                //     console.log(i);

                //     const id=i;

                //     const chan = {};
                //     self.ChanCoreContract.getChan(id).then( chanData => {
                //     console.log(id);
                //       chan.id = id;
                //       chan.name = chanData[0];
                //       chan.create_time = chanData[1].c[0];
                //       chan.level = chanData[2].c[0];
                //       chan.gender = chanData[3] ? "female" : "male";
                //       chan.url = "https://s3.amazonaws.com/cryptochans/" + id + ".jpg";
                //     }).then( () => {
                //       console.log(chan);
                //       self.SaleAuctionCoreContract.getAuction(i).then( auctionData => {
                //         chan.seller           = auctionData[0];
                //         chan.starting_price   = auctionData[1];
                //         chan.ending_price     = auctionData[2];
                //         chan.auction_duration = auctionData[3];
                //         chan.started_at       = auctionData[4];
                //       });
                //     }).then( () => {
                //       self.SaleAuctionCoreContract.getCurrentPrice(i).then( price => {
                //         chan.current_price = price/1000000000000000+" (milliETH)";
                //         console.log(chan);
                //       self.setState({fake_data:self.state.fake_data.concat([chan])});
                //       });
                //     });

                // }
            });*/
        });
    }


    buy(idol_id){
      self=this;
      console.log(this.state.ownerName);
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
            alert("successful, you may need to wait for a while before you can see the update. It may fail because of concurrent transactions. The name of the buyer who win the bid will be shown. Transaction takes about 15 seconds to finish. Please refresh later.");
            //refresh page
          });
        });
    }

    
    // initialize(){
    componentWillMount() {
        const self=this;

  self.setState({fake_data:[]});
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
        })

      



    }


      handleNameChange(event){
    console.log(event.target.value);
    this.setState({ownerName: event.target.value});
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
      'height':'590px',
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

    self=this;

    function tociclednumber(num) {
      if (num < 0 || num >= 50) {
        return num
      }
      return '⓪ ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑯ ⑰ ⑱ ⑲ ⑳ ㉑ ㉒ ㉓ ㉔ ㉕ ㉖ ㉗ ㉘ ㉙ ㉚ ㉛ ㉜ ㉝ ㉞ ㉟ ㊱ ㊲ ㊳ ㊴ ㊵ ㊶ ㊷ ㊸ ㊹ ㊺ ㊻ ㊼ ㊽ ㊾ ㊿'.split(' ')[num]
    }

    function computeowner(ownername) {
      if (ownername == null || ownername === '') {
        return <b>No owner</b>
      }
      return <span><b>Owner</b> {ownername}</span>
    }

    return (
      <div>
        <h1>{this.contract}</h1>
        <div>
          <Grid>
            <Row>
              {this.state.fake_data.map(function(d, idx){
                const tooltip = (
                  <Tooltip id="tooltip">
                    <strong>Address</strong> {d.ownerAddress}
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
                  <p><b>Value</b> {d.value} mETH</p>
                  <p><b>Sell Price</b> {d.sellPrice} mETH</p>
                  <p>
                    <input placeholder="Your name" id="myname" type="text" onChange={self.handleNameChange.bind(self)}></input>
                  </p>

                  <div style={centerbuttonouter}>
                      <Button style={bstyle} onClick={buy_func.bind(null,d.id)}>
                          Buy!
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
      </div>
    )
  }
}
