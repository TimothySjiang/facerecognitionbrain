import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Regisiter/Regisiter';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css';





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

const initialState = {
	input:'',
	imageUrl:"",
	boxes: [],
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

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
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

	calculateFaceLocations = (data) => {

		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);

		const regions = data.outputs[0].data.regions.map(region => {
			const clarifaiface = region.region_info.bounding_box;
			return{
				leftCol: clarifaiface.left_col * width,
				topRow: clarifaiface.top_row * height,
				rightCol: width - (clarifaiface.right_col * width),
				bottomRow: height - (clarifaiface.bottom_row * height),
			};
		});
		 console.log("regions", regions);
		return regions;
	}

	displayFaceBox = (boxes) => {
		this.setState({boxes:boxes});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onImageSubmit = () => {
		this.setState({imageUrl:this.state.input});
		fetch('https://damp-dusk-15044.herokuapp.com/imageurl',{
			method:'post',
			headers:{'Content-Type':"application/json"},
			body: JSON.stringify({
				input: this.state.input,
			})
		})
		.then(response => response.json())
		.then(response => {
			if (response) {				
				fetch(' https://damp-dusk-15044.herokuapp.com/image',{
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
				.catch(console.log)
			}
			this.displayFaceBox(this.calculateFaceLocations(response));
		})
		.catch(err => console.log(err));
	}

	onRouteChange = (route) => {
		if (route ==='signout'){
			this.setState(initialState)
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route:route})
	}

	render(){
		const { isSignedIn, imageUrl, route, boxes,user} = this.state;
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
				<FaceRecognition boxes = {boxes} imageUrl = {imageUrl}/>	
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
