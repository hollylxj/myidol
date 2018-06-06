pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract MyIdol is Ownable {

	/*** EVENTS ***/

    event IdolBought(address owner, uint256 idolId, uint256 price);
    event IdolOwnerNameChanged(uint256 _idolId, string _newOwnerName);

    /*** DATA TYPES ***/

    struct Idol {
    	string idolName;
    	string ownerName;
    	address ownerAddress;
    	uint256 value;
    }

    /*** CONTRACT VARIABLES ***/

    string public constant name = "MyIdol";

    uint256 minimumMarkUp = 20; //in percent
    uint256 ownerCut = 50; //in percent
    uint256 initialIdolValue = 1 finney; //1 milliether

    Idol[37] idols;	//0-th idol is invalid. Only 1-36 are valid.

    /*** CONSTRUCTOR ***/

    constructor() public {
    	// idols[1].idolName = "ChingChong";
    	idols[1].idolName = "孟美岐";
		idols[2].idolName = "杨超越";
		idols[3].idolName = "吴宣仪";
		idols[4].idolName = "yamy";
		idols[5].idolName = "段奥娟";
		idols[6].idolName = "李紫婷";
		idols[7].idolName = "紫宁";
		idols[8].idolName = "杨芸晴";
		idols[9].idolName = "傅菁";
		idols[10].idolName = "强东玥";
		idols[11].idolName = "高秋梓";
		idols[12].idolName = "高颖浠";
		idols[13].idolName = "李子璇";
		idols[14].idolName = "赖美云";
		idols[15].idolName = "刘人语";
		idols[16].idolName = "徐梦洁";
		idols[17].idolName = "戚砚笛";
		idols[18].idolName = "赵尧珂";
		idols[19].idolName = "陈芳语";
		idols[20].idolName = "吕小雨";
		idols[21].idolName = "王莫涵";
		idols[22].idolName = "焦曼婷";
		idols[23].idolName = "王菊";
		idols[24].idolName = "吴芊盈";
		idols[25].idolName = "蒋申";
		idols[26].idolName = "吴映香";
		idols[27].idolName = "魏瑾";
		idols[28].idolName = "鹿小草";
		idols[29].idolName = "苏芮琪";
		idols[30].idolName = "罗怡恬";
		idols[31].idolName = "许靖韵";
		idols[32].idolName = "罗奕佳";
		idols[33].idolName = "范薇";
		idols[34].idolName = "王婷";
		idols[35].idolName = "陈意涵";
		idols[36].idolName = "刘丹萌";



    }

    /*** MODIFIERS ***/

    //0-th idol is invalid. Only 1-101 are valid.
    modifier isValidIdol(uint256 _id) {
    	require(0 < _id && _id < idols.length);
    	_;
    }

    /*** PUBLIC FUNCTIONS ***/

    function totalSupply() public view returns (uint256) {
    	return idols.length - 1;
    }

    function getIdol(uint256 _idolId)
    	public
    	view
    	isValidIdol(_idolId)
    	returns (
    	string idolName,
    	string ownerName,
    	address ownerAddress,
    	uint256 value,
    	uint256 sellPrice
    ) {
    		Idol memory idol = idols[_idolId];
    		idolName     = idol.idolName;
    		ownerName    = idol.ownerName;
    		ownerAddress = idol.ownerAddress;
    		value        = idol.value;
    		sellPrice    = _sellPrice(idol);
    }

    function getIdol2(uint256 _idolId)
    	public
    	view
    	isValidIdol(_idolId)
    	returns (
    	bytes32 idolName,
    	bytes32 ownerName,
    	address ownerAddress,
    	uint256 value,
    	uint256 sellPrice
    ) {
    		Idol memory idol = idols[_idolId];
    		idolName     = _stringToBytes32(idol.idolName);
    		ownerName    = _stringToBytes32(idol.ownerName);
    		ownerAddress = idol.ownerAddress;
    		value        = idol.value;
    		sellPrice    = _sellPrice(idol);
    }


    function getIdols()
    	public
    	view
    	returns (
    	uint256[36] idolIds,
    	bytes32[36] idolNames,
    	bytes32[36] ownerNames,
    	address[36] ownerAddresses,
    	uint256[36] values,
    	uint256[36] sellPrices
    ) {
    		for(uint256 i = 0; i < idols.length - 1; i++){
    			Idol memory idol  = idols[i + 1];
    			idolIds[i]        = i + 1;
	    		idolNames[i]      = _stringToBytes32(idol.idolName);
	    		ownerNames[i]     = _stringToBytes32(idol.ownerName);
	    		ownerAddresses[i] = idol.ownerAddress;
	    		values[i]         = idol.value;
	    		sellPrices[i]     = _sellPrice(idol);
    		}
    }


    //Function to purchase an idol
    function buyIdol(uint256 _idolId, string _newOwnerName)
    	public
    	payable
    	isValidIdol(_idolId)
    {
    	Idol storage idol = idols[_idolId];
    	require(msg.value >= _sellPrice(idol));

    	//Transfer funds
        if(idol.ownerAddress != 0){
    	   uint256 profit = msg.value - idol.value;
    	   uint256 sellerProceeds = msg.value - _computeCut(profit);
    	   address(idol.ownerAddress).transfer(sellerProceeds);
        }

    	//Update Idol parameters
    	idol.ownerName = _newOwnerName;
    	idol.ownerAddress = msg.sender;
    	idol.value = msg.value;

    	//Emit event
    	emit IdolBought(msg.sender, _idolId, idol.value);
    }

    //Function to change Idol's owner name
    function changeOwnerName(uint256 _idolId, string _newOwnerName)
    	public
    	isValidIdol(_idolId)
    {
    	Idol storage idol = idols[_idolId];

    	//Only Idol's owner can do this
    	require(idol.ownerAddress == msg.sender);
    	
    	idol.ownerName = _newOwnerName;

    	//Emit event
    	emit IdolOwnerNameChanged(_idolId, _newOwnerName);
    }

    //Allows contract owner to check contract balance
    function checkBalances() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    //Allows contract owner to retrieve funds stored in contract
    function withdrawBalances() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    /*** HELPER FUNCTIONS***/

    //Obtains next selling price of idol
    //@param Idol idol: idol object
    function _sellPrice(Idol _idol)
    	private
    	view
    	returns (uint256)
    {
		if(_idol.value == 0){
			return initialIdolValue;
		}
		return _idol.value * (100 + minimumMarkUp) / 100;
    }

    // Computes owner's cut of a sale.
    // @param _price - Sale price of idol.
    function _computeCut(uint256 _price)
    	private
    	view
    	returns (uint256)
    {
        return _price * ownerCut / 100;
    }

    function _stringToBytes32(string memory source)
    	private
    	pure
    	returns (bytes32 result)
    {
	    bytes memory tempEmptyStringTest = bytes(source);
	    if (tempEmptyStringTest.length == 0) {
	        return 0x0;
	    }

	    assembly {
	        result := mload(add(source, 32))
	    }
	}


}