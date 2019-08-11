import React, {Component} from 'react';

class Regisiter extends Component{
	constructor(props){
		super();
		this.state = {
			regisiterName:'',
			regisiterEmail:'',
			regisiterPassword:'',
		}
	}

	onNameChange = (event) => {
		this.setState({regisiterName: event.target.value})
	}

	onEmailChange = (event) => {
		this.setState({regisiterEmail: event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({regisiterPassword: event.target.value})
	}

	onSubmitRegisiter = () => {
		fetch('http://localhost:3000/regisiter',{
					method:'post',
					headers:{'Content-Type':"application/json"},
					body: JSON.stringify({
						name : this.state.regisiterName,
						email: this.state.regisiterEmail,
						password: this.regisiterPassword,
					})
				})
				.then(response => response.json())
				.then(user => {
					if (user){
						this.props.loadUser(user);
						this.props.onRouteChange('home');
					}
				})
	}

	render(){
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Regisiter</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="Name">Name</label>
				        <input 
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="text" 
				        	name="name"  
				        	id="name" 
				        	onChange = {this.onNameChange}
				        />
				      </div>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				         	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				         	type="email" 
				         	name="email-address"  
				         	id="email-address" 
				         	onChange = {this.onEmailChange}
				         />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="password" 
				        	name="password"  
				        	id="password" 
				        	onChange = {this.onPasswordChange}
				        />
				      </div>
				  
				    </fieldset>
				    <div className="">
				      <input 
				      	  onClick= {this.onSubmitRegisiter}
					      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
					      type="submit" 
					      value="Regisiter" 
					    />
				    </div>
				  </div>
				</main>
			</article>
		);
	}
}

export default Regisiter;