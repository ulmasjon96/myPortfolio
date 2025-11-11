import Content from './layouts/Content';
import Header from './layouts/Header';
import './scss/App.css';
import './scss/Mobile.css';

export default function App() {
	return (
		<>
			<div className='App'>
				<Header />
				<Content />
			</div>
		</>
	);
}
