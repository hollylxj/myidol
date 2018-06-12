import React, { Component } from 'react'
import MyIdolContract from '../node_modules/myidol/build/contracts/MyIdol.json'
import translator from './utils/translator'
import getWeb3 from './utils/getWeb3'

import logo from './logo.jpg'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Toolbar from 'material-ui/Toolbar'

import {Alert,Navbar, Jumbotron, Button, Panel,Carousel, Grid,Col, Row} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from 'react-router-dom';



import Idols from './pages/Idols'
import Admin from './pages/Admin'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'




class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      admin: false,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })

    this.setState({lang:translator.getLocale()})
  }

  instantiateContract() {
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
    console.log(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);

      console.log({userAccount: accounts[0]});
      this.setState({account:accounts[0]});

      myIdol.deployed().then((instance) => {
        console.log("Successfully deployed MyIdol");
        console.log(instance);
        this.setState({MyIdolInstance : instance});

        instance.owner().then(result => {
          console.log("Contract Owner: " + result);
          console.log("Current Account: " + this.state.account);
          console.log("IsOwner: " + (result==this.state.account));
          this.setState({admin:result==this.state.account});
        });
      });

    })



          this.state.web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          console.log('This is mainnet')
          this.setState({eth_detect:true});
          break
        case "2":
          console.log('This is the deprecated Morden test network.')
          this.setState({eth_detect:false});
          break
        case "3":
          console.log('This is the ropsten test network.')
          this.setState({eth_detect:false});
          break
        case "4":
          this.setState({eth_detect:false});
          console.log('This is the Rinkeby test network.')
          break
        case "42":
          console.log('This is the Kovan test network.')
          this.setState({eth_detect:false});
          break
        default:
          console.log('This is an unknown network.')
          this.setState({eth_detect:false});
      }
    })
  }

  setLanguageToEn(){
    translator.setLocale('en');
    this.setState({lang:'en'});
  }

  setLanguageToZh(){
    translator.setLocale('zh');
    this.setState({lang:'zh'});
  }

  render() {

    let AdminDisplay = this.state.admin?        
          <Link to="/produce101/admin"><Button bsStyle="info">Admin</Button></Link>:null;


    let jstyle={
      'background-color':"pink"
    }

    let istyle={
      'width':'100px',
      'height':'100px'
    }

    const pStyle = {
      'color': '#f4428c',
    };

    const imgStyle={
      'width':'30px',
      'height':'30px'
    };


    let eth_detect = this.state.eth_detect ? "./on.jpg" : "./off.jpg";

    var any_alert = this.state.eth_detect ? null : <Alert bsStyle="warning">
      <strong>Warning: {translator.translate('HOME_warning')}</strong>
    </Alert>;


    return (

        <div>
        <span style={pStyle} >{translator.translate('HOME_activeAccount')}: {this.state.account}</span>
          <Router basename={'/produce101/'}>
            <div className="App">

             {any_alert} 
             
        
            <Button bsStyle="primary" id="languageButton" disabled={this.state.lang === 'en'} onClick={this.setLanguageToEn.bind(this)}>
              English
            </Button>
            <Button bsStyle="primary" id="languageButton" disabled={this.state.lang === 'zh'} onClick={this.setLanguageToZh.bind(this)}>
              中文
            </Button>
            <Jumbotron style={jstyle}>
              <img style={istyle} src={require('./logo.jpg')}/>
              <br/>
              <br/>


              <p>
                
              </p>

              <p>
                {translator.translate('HOME_description')}
              </p>

            </Jumbotron>


              <header>
              </header>
              <div>
                {AdminDisplay}
        

                <Switch>
                  <Route path="/produce101/admin" render={(props) => <Admin {...props} contract={this.state.MyIdolInstance} />} />
                  <Route path="/produce101/idols" render={(props) => <Idols {...props} lang={translator.getLocale()}/>} />
                  <Route path="/" render={(props) => <Idols {...props} />} />
                  <Route path="/no" render={(props)=>
                    <Grid>
                      <Col xs={14} md={20}>
                        <Row xs={10} md={10}>
                          <Carousel>
                            <Carousel.Item>
                              <img width={900} height={500} alt="900x500" src="http://img.wxcha.com/file/201711/28/0ba7b1180e.jpg?down" />
                              <Carousel.Caption>
                                <h3>My Idol</h3>
                              </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                              <img width={900} height={500} alt="900x500" src="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg" />
                              <Carousel.Caption>
                                <h3>Second slide label</h3>
                                <p>My Idol</p>
                              </Carousel.Caption>
                            </Carousel.Item>
                          </Carousel>
                        </Row>
                      </Col>
                    </Grid>
                  }/>
                </Switch>
              </div>
            </div>
          </Router>
        </div>

    );
  }
}
export default App