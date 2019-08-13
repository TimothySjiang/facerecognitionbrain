import React ,{Component} from 'react';
import './FaceRecognition.css';

class FaceRecognition extends Component{
	render(){
		const {imageUrl, boxes} = this.props;
		const faceBoxes = boxes.map(box => {
			return <div 
			className='bounding-box' 
			style={{top:box.topRow, right:box.rightCol, bottom:box.bottomRow, left:box.leftCol}}>
			</div>;
		});
		return(
			<div className='center ma'>
			<div className='absolute mt2'>
			<img id='inputimage' alt='iamge' src={imageUrl} width="500px" height='auto'/>
			{faceBoxes}
			</div>
			</div>
			);
	}
}

export default FaceRecognition;