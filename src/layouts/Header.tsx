import React, { useEffect, useRef } from 'react';
import logo from '../assets/img/head.jpg';
import '../scss/Header.css';

/*
  Header komponenti: sahifaning bosh qismi (hero) uchun
  - typewriter effektini DOM elementga yozish orqali beradi
  - TypeScript (tsx)da yozilgan va React.FC turidan foydalanadi
*/
const Header: React.FC = () => {
	// useRef orqali <div className="typewriter"> elementiga murojaat qilish uchun
	// typewriterRef.current sahifada element mount bo'lgandan keyin HTMLDivElement bo'ladi,
	// render paytida esa boshlang'ich qiymati `null` bo'ladi.
	const typewriterRef = useRef<HTMLDivElement | null>(null);

	/*
    useEffect: komponent mount bo'lganda typewriter effektini ishga tushiradi.
    Bo'sh dependency array `[]` tufayli bu effekt faqat bir marta (mount da) ishga tushadi.
  */
	useEffect(() => {
		'use strict'; // eski brauzerlar uchun qat'iy rejim (ixtiyoriy)

		// So‘zlar ro‘yxati — typewriter shu so‘zlarni ketma-ket yozib-o‘chiradi
		const phrases: string[] = ["Ismatov O'lmasjon", 'Developer', 'Front-end', 'Design', 'WEB 3.0'];

		// idx: hozirgi so'z indexi (phrases ichida)
		let idx = 0;
		// char: joriy so'zdagi hozirgi harf indexi (qaysi harfgacha yozildi)
		let char = 0;
		// currentText: hozir ekranda turgan matnni harf-harf qilib saqlash uchun massiv
		let currentText: string[] = [];
		// deleting: o'chirish rejimida yoki yo'qligini bildiradi
		let deleting = false;
		// isEnd: joriy so'zning oxiriga yetilganini (shu payt pauza berish uchun)
		let isEnd = false;
		// timeoutId: setTimeout natijasini saqlash uchun (tozalash imkoniyati uchun)
		let timeoutId: ReturnType<typeof setTimeout>;

		/*
      typeText funksiyasi:
      - yozish va o'chirishni boshqaradi
      - har bir chaqiriqda DOMdagi elementning textContent-ni yangilaydi
      - keyingi chaqiriqni setTimeout orqali rejalashtiradi
    */
		function typeText(): void {
			// har safar ishga tushganda joriy "so'z tugadi" flagini false qilamiz
			isEnd = false;

			// DOM elementni olish (agar hali mount bo'lmasa null bo'ladi)
			const el = typewriterRef.current;
			// agar element hali yo'q bo'lsa — funksiyani to'xtatamiz (hech narsa qilmaymiz)
			if (!el) return;

			// ---------- YOZISH (typing) qismi ----------
			// Agar hozir o'chirish rejimida bo'lmasa va char joriy so'z uzunligidan kichik yoki teng bo'lsa
			if (!deleting && char <= phrases[idx].length) {
				// joriy so'zning (phrases[idx]) char-indeksidagi harfni currentText massiviga qo'shamiz
				// (agar char === length bo'lsa undefined qo'shmasligi uchun <= ishlatilgan; lekin undefined
				//  paydo bo'lsa join qilib chiqarilsa "undefined" chiqmasligi uchun keyinchalik tekshirsa bo'ladi)
				const nextChar = phrases[idx][char];
				if (nextChar !== undefined) {
					currentText.push(nextChar);
					char++;
				}
				// DOMga hozirgi matnni qo'yamiz (masivni stringga aylantirib)
				el.textContent = currentText.join('');
			}

			// ---------- O'CHIRISH (deleting) qismi ----------
			// Agar o'chirish rejimida bo'lsak va hali o'chirish uchun harflar qolgan bo'lsa
			if (deleting && char > 0) {
				// oxirgi qo'shilgan harfni olib tashlaymiz
				currentText.pop();
				char--;
				// DOMni yangilaymiz
				el.textContent = currentText.join('');
			}

			// ---------- SO'ZNING O'ZGARISHI / PAUZA ----------
			// Agar char hozirgi so'z uzunligiga teng bo'lsa, so'z tugadi — biroz pauza berish uchun isEnd=true va deleting=true qilamiz
			if (char === phrases[idx].length) {
				isEnd = true;
				deleting = true; // so'ng o'chirish jarayoni boshlanadi
			}

			// Agar o'chirish tugagan bo'lsa (char === 0) — keyingi so'zni boshlash uchun sozlash
			if (deleting && char === 0) {
				// currentText bo'shatiladi, deleting false qilinadi va idx keyingiga o'tadi
				currentText = [];
				deleting = false;
				idx++;
				// agar oxirgi so'z tugagan bo'lsa — qaytadan boshidan boshlash (loop)
				if (idx === phrases.length) idx = 0;
			}

			// ---------- TEZLIKNI SOZLASH ----------
			// Yozish va o'chirish tezligini biroz tasodifiy qilish tabiatga yaqin ko'rinish beradi
			const speedUp = Math.random() * (80 - 50) + 50; // o'chirish tezligi (tezroq)
			const normalSpeed = Math.random() * (200 - 100) + 100; // yozish tezligi (sekinroq)
			// Agar so'z tugagan bo'lsa 2 soniyalik pauza beramiz; o'chirish bo'lsa tezroq; aks holda normal tezlik
			const time = isEnd ? 2000 : deleting ? speedUp : normalSpeed;

			// keyingi chaqiriqni rejalashtiramiz va timeout id sini saqlaymiz (cleanup uchun)
			timeoutId = setTimeout(typeText, time);
		}

		// Komponent o'rnatilganda (mount) typeText funksiyasini 0.8s (800ms)dan keyin boshlaymiz
		const startTyping = setTimeout(typeText, 800);

		// useEffect cleanup: komponent unmount bo'lganda barcha timeoutlarni tozalaymiz
		// bu muhim — aks holda backgroundda timeoutlar ishlashda davom etadi va xatolarga olib keladi
		return () => {
			clearTimeout(startTyping);
			clearTimeout(timeoutId);
		};
		// Bo'sh dependency array — bu effekt faqat birinchi renderda ishga tushadi
	}, []);

	// ---------- JSX — render qismi ----------
	// Kodni style va struktura uchun bu yerda HTML tuzilishi joylashgan.
	return (
		<div className='header'>
			<div className='home_page'>
				{/* Ijtimoiy iconlar */}
				<header className='social-icons'>
					<a href='' className='glow-icon github' target='_blank' rel='noreferrer'>
						<i className='bx bxl-github'></i>
					</a>
					<span>
						<a href='' className='glow-icon vk' target='_blank' rel='noreferrer'>
							<i className='bx bxl-vk'></i>
						</a>
						<a href='' className='glow-icon instagram' target='_blank' rel='noreferrer'>
							<i className='bx bxl-instagram'></i>
						</a>
						<a href='' className='glow-icon telegram' target='_blank' rel='noreferrer'>
							<i className='bx bxl-telegram'></i>
						</a>
						<a href='' className='glow-icon gmail'>
							<i className='bx bxl-gmail'></i>
						</a>
					</span>
				</header>

				{/* Hero/intro bo'limi */}
				<section id='hero' className='hero_section'>
					<div className='hero_text'>
						{/* "Hello everyone, I'm" matni harharfsiz span bilan yozilgan (vizual effektlar uchun) */}
						<h1 className='blink'>
							<span>H</span>
							<span>e</span>
							<span>l</span>
							<span>l</span>
							<span>o</span>
							<span>&nbsp;</span>
							<span>e</span>
							<span>v</span>
							<span>e</span>
							<span>r</span>
							<span>y</span>
							<span>o</span>
							<span>n</span>
							<span>e</span>
							<span>,</span>
							<span>&nbsp;</span>
							<span>I</span>
							<span>'</span>
							<span>m</span>
						</h1>

						{/* Typewriter yozuvi uchun element */}
						{/* typewriterRef bu elementga ulanadi va biz JS orqali uning textContent ni o'zgartiramiz */}
						<div ref={typewriterRef} className='typewriter'></div>
					</div>

					{/* Rasm/hero image */}
					<div className='hero_image'>
						<img src={logo} alt='Hero' />
					</div>
				</section>
			</div>
		</div>
	);
};

export default Header;
