import React from 'react';
import getWeb3 from '../../utils/getWeb3'

import MyIdolContract from '../../../node_modules/myidol/build/contracts/MyIdol.json'

import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class Idols extends React.Component {
    constructor(props) {
       super(props)

       this.state = {
         admin: false,
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
        myIdol.setProvider(this.state.web3.currentProvider);

        myIdol.deployed().then((instance) => {
            console.log("Successfully deployed MyIdol");
            // this.setState({ChanCoreContract : instance});
            self.MyIdolContract = instance;
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
        console.log(idol_id);
        self = this;
        var ownerName = "Owner Name"; //temporary

        this.MyIdolContract.getIdol(idol_id).then(idolData => {
          console.log(idolData);
          const priceInWei = this.state.web3.fromWei(idolData[4].toNumber(), "finney");
          console.log("Price:"+priceInWei/1000000000000000+" (milliETH)");
          this.MyIdolContract.buyIdol.sendTransaction(idol_id, ownerName, {
            from:this.state.account,
            to:this.MyIdolContract.address,
            value:priceInWei,
            gas:1000000
          }).then(result => {
            alert("successful, you may need to wait for a while before the chan appear in MyChans");
            //refresh page
          });
        });
    }

    
    // initialize(){
    componentWillMount() {
        const self=this;

        getWeb3
        .then(results => {
          this.setState({
            web3: results.web3
          });
          // Get accounts.
          results.web3.eth.getAccounts((error, accounts) => {
            this.setState({account:accounts[0]});
          });

          this.instantiateContract();        
        })

        self.setState({fake_data:[]});



    }



  render() {
    const buy_func = this.buy.bind(this);
    const account = this.state.account;


    return (
      <div>
        <h1>{this.contract}</h1>
        <div>
          <Grid>
            <Row>
              {this.state.fake_data.map(function(d, idx){
                return (<Col xs={6} md={4}>
                  <Thumbnail src={require("../../101/"+d.id+".png")} alt="Image not available">
                  <h3>Name:{d.name}</h3>
                  <p>Id:{d.id}</p>
                  <p>Owner Name:{d.ownerName}</p>
                  <p>Owner Address:{d.ownerAdderss}</p>
                  <p>Value:{d.value} mETH</p>
                  <p>Sell Price:{d.sellPrice} mETH</p>
                  <p>
                      <Button bsStyle="primary" onClick={buy_func.bind(null,d.id)}>
                          Buy!
                      </Button>
                  </p>
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
