// React kutubxonasidan kerakli hooklarni import qilamiz
// useState – komponent holatini boshqaradi
// useEffect – komponent yuklanganda va holat o‘zgarganda yon ta’sirlarni bajaradi (event listener qo‘shish kabi)
// useRef – DOM elementlarga to‘g‘ridan-to‘g‘ri murojaat qilish uchun ishlatiladi
import { useEffect, useRef, useState } from 'react';

//

// Navbar dizayni uchun CSS faylni ulaymiz
import './Navbar.css';

// Asosiy komponent funksiyasi
export default function Navbar() {
	// 🔹 isOpen -> menyu ochilgan yoki yopilganligini saqlaydi
	// false = yopiq, true = ochiq
	const [isOpen, setIsOpen] = useState(false);

	// 🔹 headerVisible -> scroll past 600px bo‘lganda header’ni ko‘rsatish uchun ishlatiladi
	const [headerVisible, setHeaderVisible] = useState(false);

	// 🔹 useRef bilan DOM elementlarga havolalar yaratamiz
	// dropdownRef -> pastdagi menyu (mobil dropdown)
	// toggleBtnRef -> menyuni ochuvchi tugma (bars/x ikonasi)
	const dropdownRef = useRef<HTMLDivElement>(null);
	const toggleBtnRef = useRef<HTMLDivElement>(null);

	// 🔹 Audio faylni saqlash uchun referens
	const clickSound = useRef<HTMLAudioElement | null>(null);

	// 🔹 Komponent yuklanganda `click.mp3` faylni yuklab olish
	useEffect(() => {
		clickSound.current = new Audio('click.mp3');
	}, []); // [] – faqat bir marta ishlaydi (komponent birinchi marta yuklanganda)

	// 🔹 Menyuni ochish/yopish funksiyasi
	const toggleMenu = () => {
		// Agar audio fayl mavjud bo‘lsa, ovoz o‘ynatish
		if (clickSound.current) clickSound.current.play();

		// Holatni teskari o‘zgartirish (true → false yoki false → true)
		setIsOpen(prev => !prev);
	};

	// 🔹 Quyidagi effekt: menyuni tashqariga bosganda, Escape bosilganda, yoki scroll bo‘lganda yopadi
	useEffect(() => {
		// Tashqariga bosganda
		const handleClickOutside = (event: MouseEvent) => {
			// Agar foydalanuvchi dropdown yoki tugma tashqarisiga bossachi?
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) && // dropdown ichida emas
				toggleBtnRef.current &&
				!toggleBtnRef.current.contains(event.target as Node) // toggle tugmasida emas
			) {
				// Menyuni yopamiz
				setIsOpen(false);
			}
		};

		// Klaviaturadan ESC bosilganda
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsOpen(false);
		};

		// Scroll bo‘lganda
		const handleScroll = () => {
			// Agar 600px dan ko‘proq scroll qilinsa – header’ni ko‘rsatish
			if (window.scrollY >= 600) {
				setHeaderVisible(true);
			} else {
				setHeaderVisible(false);
			}

			// Agar menyu ochiq bo‘lsa, scrollda uni yopamiz
			if (isOpen) setIsOpen(false);
		};

		// Hodisalarni eshituvchi sifatida ro‘yxatga olish
		document.addEventListener('click', handleClickOutside);
		document.addEventListener('keydown', handleEscape);
		window.addEventListener('scroll', handleScroll);

		// useEffect ichidagi qaytariluvchi funksiya — komponent o‘chirilganda tozalash uchun
		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isOpen]); // har safar isOpen o‘zgarsa, listenerlar yangilanadi

	// 🔹 JSX – bu yerda UI (HTML ga o‘xshash tuzilma) render qilinadi
	return (
		// Header – yuqori qism (saytning sarlavhasi)
		// Agar headerVisible = true bo‘lsa, className ga "visible" qo‘shiladi
		<header id='page-header' className={`header ${headerVisible ? 'visible' : ''}`}>
			{/* NAVBAR asosiy konteyneri */}
			<div className='navbar'>
				{/* Logotip yoki ism */}
				<div className='logo'>
					<a href='#'> Hello I'm O'lmas</a>
				</div>

				{/* Asosiy menyu (desktop uchun) */}
				<ul className='links'>
					<li>
						<a href='#about'>About</a>
					</li>
					<li>
						<a href='#skills'>Skills</a>
					</li>
					<li>
						<a href='#code_section'>Code</a>
					</li>
					<li>
						<a href='#LibraryCard'>Library Card</a>
					</li>
					<li>
						<a href='#contacts'>Contacts</a>
					</li>
				</ul>

				{/* Mobil versiya uchun toggle tugma */}
				<div
					ref={toggleBtnRef} // DOM elementga havola
					className='toggle_btn' // CSS klass
					onClick={toggleMenu} // Tugmaga bosilganda menyuni ochish/yopish
				>
					{/* Ikona – fa-bars (menyu) yoki fa-xmark (yopish) */}
					<i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
				</div>
			</div>

			{/* Mobil versiyada chiqadigan dropdown menyu */}
			<div
				ref={dropdownRef} // dropdown elementni ref bilan belgilaymiz
				className={`dropdown_menu ${isOpen ? 'open' : ''}`} // open klassi faqat menyu ochiq bo‘lganda qo‘shiladi
			>
				<li>
					<a href='#about'>About</a>
				</li>
				<li>
					<a href='#skills'>Skills</a>
				</li>
				<li>
					<a href='#code_section'>Code</a>
				</li>
				<li>
					<a href='#LibraryCard'>Library Card</a>
				</li>
				<li>
					<a href='#contacts'>Contacts</a>
				</li>
			</div>
		</header>
	);
}
