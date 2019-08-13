import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Regisiter/Regisiter';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css';


const app = new Clarifai.App({
 apiKey: 'fc08fb06fc944bac9f819745b9ae8ca7'
});


const particalOptions ={
	particles: {
 		number: {
 			value:100,
 			density: {
 				enable: true,
 				value_area:800,
 			}
 		},
 		 line_linked: {
 		 	shadow: {
 		 		enable:true,
 		 		color:"#3CA9D1",
 		 		blur:5,
 		 	}
 		}
 	}
 } 

class App extends Component {
	constructor() {
		super();
		this.state = {
			input:'',
			imageUrl:"",
			box: {},
			route:'signin',
			isSignedIn:false,
			user: {
				id:'',
				name:'',
				email :'',
				entries:0,
				joined:'',
			}
		}
	} 


	loadUser = (data) => {
		this.setState({
			user: {
					id:data.id,
					name:data.name,
					email :data.email,
					entries:data.entries,
					joined:data.joined,
				}
		})
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol:clarifaiFace.left_col*width,
			topRow: clarifaiFace.top_row*height,
			rightCol:width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row*height,
		}
	}

	displayFaceBox = (box) => {
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onImageSubmit = () => {
		this.setState({imageUrl:this.state.input});
		app.models
			.predict(
				Clarifai.FACE_DETECT_MODEL,
				this.state.input)
			.then(response => {
				if (response) {
					fetch('http://localhost:3000/image',{
						method:'put',
						headers:{'Content-Type':"application/json"},
						body: JSON.stringify({
							id: this.state.user.id,
						})
					})
					.then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user,{entries:count}))
					})
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch(err => console.log(err));
	}

	onRouteChange = (route) => {
		if (route ==='signout'){
			this.setState({isSignedIn:false})
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route:route})
	}

	render(){
		  const { isSignedIn, imageUrl, route, box,user} = this.state;
		  return (
		    <div className="App">
		    	<Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />
		    	{
		    	route ==='home' 
		    	?<div>
		    		<Logo />
			    	<Particles className = 'particles' params={particalOptions} on/>
			     	<Rank name = {user.name} count = {user.entries} />
			      	<ImageLinkForm 
			      	onInputChange = {this.onInputChange} 
			      	onImageSubmit = {this.onImageSubmit} 
			      	/>
			      	<FaceRecognition box = {box} imageUrl = {imageUrl}/>	
			     </div>
			    : 	(
			    	route === 'signin'
			    	? <Signin loadUser = {this.loadUser}  onRouteChange={this.onRouteChange} />
			    	: <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange} />
		      		)
		    	}
		    </div>
		  );
		}
}

export default App;
