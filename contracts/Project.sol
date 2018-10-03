pragma solidity ^0.4.16;

contract AbstractProject {
  
  function balanceOf(address _who) public view returns (uint256);

  //function transfer(address _to, uint256 _value) public returns (bool);

  function transferFrom(address _from, address _to, uint256 _value)
    public returns (bool);
}

contract Project is AbstractProject {
    
    address public owner;
    mapping (address => uint256) public balances;
    
    constructor () public {
			owner = msg.sender;
		} 
		
	function() public payable {
        balances[msg.sender] = balances[msg.sender] + msg.value;
    }

    function balanceOf(address _who) public view returns (uint256) {
        return balances[_who];
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(balances[_from] >= _value);
        balances[_from] = balances[_from] - _value;
        balances[_to] = balances[_to] + _value;
    }
}
