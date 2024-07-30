/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from "react";
import {
	useNavigate,
	useSearchParams,
} from "react-router-dom";

// img
import Before_Robot_X from "../../../img/Before_Robot_X.svg";
import Before_Drone_X from "../../../img/Before_Drone_X.svg";
import Before_AR_X from "../../../img/Before_AR_X.svg";
import Before_VR_X from "../../../img/Before_VR_X.svg";
import Before_Car_X from "../../../img/Before_Car_X.svg";
import After_Car_O from "../../../img/After_Car_O.svg";
import After_Drone_O from "../../../img/After_Drone_O.svg";
import After_Robot_O from "../../../img/After_Robot_O.svg";
import After_VR_O from "../../../img/After_Vr_O.svg";
import stampbasico from "../../../img/stampbasico.png";
import stampbasicx from "../../../img/stampbasicx.png";

// constants
import BoothInfo from "../article/BoothInfo";
import {useCookies} from "react-cookie";
import axios from "axios";

const Stampmain = () => {
	const navigation = useNavigate();
	const [, setCookies, removeCookies] = useCookies([
		"token",
		"stampedidCookie",
	]);
	const [searchParams] = useSearchParams();
	const stampedId = searchParams.get("stampedId");
	const stampIdCookie = localStorage.getItem("stampedId");
	const Ltoken = localStorage.getItem("token");
	const booths = [
		{
			id: 1,
			name: "로봇 체험존",
			beforeSrc: Before_Robot_X,
			afterSrc: After_Robot_O,
		},
		{
			id: 2,
			name: "드론 체험존",
			beforeSrc: Before_Drone_X,
			afterSrc: After_Drone_O,
		},
		{
			id: 3,
			name: "AR 체험존",
			beforeSrc: Before_AR_X,
			afterSrc: After_Drone_O,
		},
		{
			id: 4,
			name: "VR 체험존",
			beforeSrc: Before_VR_X,
			afterSrc: After_VR_O,
		},
		{
			id: 5,
			name: "자율주행 체험존",
			beforeSrc: Before_Car_X,
			afterSrc: After_Car_O,
		},
		{
			id: 6,
			name: "mission",
			beforeSrc: stampbasicx,
			afterSrc: stampbasico,
		},
		{
			id: 7,
			name: "mission",
			beforeSrc: stampbasicx,
			afterSrc: stampbasico,
		},
		{
			id: 8,
			name: "mission",
			beforeSrc: stampbasicx,
			afterSrc: stampbasico,
		},
		{
			id: 9,
			name: "mission",
			beforeSrc: stampbasicx,
			afterSrc: stampbasico,
		},
		{
			id: 10,
			name: "mission",
			beforeSrc: stampbasicx,
			afterSrc: stampbasico,
		},
	];

	const [visible, setVisible] = useState(false);
	const [selectedBoothId, setSelectedBoothId] =
		useState(null);

	const [boolean, setBoolean] = useState(
		new Array(10).fill(false)
	);
	const [userData, setUserData] = useState();

	const [stampedBooths] = useState([]);

	const getData = async () => {
		try {
			const res = await axios.get(
				"https://stamptour.xyz/api/userinfo",
				{
					headers: {
						Authorization: `Bearer ${Ltoken}`,
					},
				}
			);
			console.log("유저 데이터 가져오기 성공: ", res.data);

			if (res.status === 200) {
				setUserData(res.data);
				const qrArray = new Array(10).fill(false);

				// qr 값 탐색 후 배열에 저장
				Object.keys(res.data).forEach((key) => {
					if (
						key.startsWith("qr") &&
						res.data[key] === true
					) {
						const index =
							parseInt(key.replace("qr", "")) - 1; // qr1 -> index 0
						if (
							!isNaN(index) &&
							index >= 0 &&
							index < qrArray.length
						) {
							qrArray[index] = true;
						}
					}
				});

				setBoolean(qrArray);
			}
		} catch (e) {
			console.log("get data error : ", e);
		}
	};

	const saveQRData = async () => {
		try {
			const res = await axios.post(
				`https://stamptour.xyz/api/savestamp?stampedId=${
					stampedId !== null ? stampedId : stampIdCookie
				}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${Ltoken}`,
					},
				}
			);
			console.log("QR 저장 성공!!!!: ", res);
			if (res.status === 200) {
				getData();
				removeCookies("stampedidCookie");
			}
		} catch (e) {
			console.log("qr save error : ", e);
		}
	};

	useEffect(() => {
		saveQRData();
	}, []);

	useEffect(() => {
		if (!Ltoken) {
			navigation("/");
			return;
		}

		getData();

		if (stampedId) {
			const id = parseInt(stampedId, 10);
			setBoolean((prevBoolean) => {
				let newArray = [...prevBoolean];
				newArray[id - 1] = true; // 인덱스는 0부터 시작하므로 id-1 사용
				return newArray;
			});

			saveQRData();
			// if (!stampedBooths.includes(id)) {
			// 	setStampedBooths((prev) => [...prev, id]);

			// }
		}
	}, []);

	useEffect(() => {
		// console.log("accessToken:", accessToken);
		if (!Ltoken) {
			setCookies("stampedidCookie", stampedId, {
				path: "/",
				sameSite: "None",
				secure: true,
			});
			localStorage.setItem("stampedId", stampedId);
			navigation("/");
		}
	}, [Ltoken, stampedId]);

	const handleClick = (boothId) => {
		setSelectedBoothId(boothId);
		setVisible(!visible);
	};

	useEffect(() => {
		console.log("boolean: ", boolean);
		console.log("userData: ", userData);
		console.log("booths: ", booths);
	}, [boolean, userData, stampedBooths]);

	const newBooth = booths.map((booth) => {
		const isStamped = boolean[booth.id - 1]; // boolean 배열을 사용하여 상태 확인
		const src =
			isStamped === true ? booth.afterSrc : booth.beforeSrc;

		return (
			<button
				onClick={() => handleClick(booth.id)}
				key={booth.id}
				className='relative flex flex-col items-center justify-center bg-[white] w-full h-full pt-[25px] pb-[15px]'
			>
				{visible && selectedBoothId === booth.id && (
					<BoothInfo boothid={booth.id} />
				)}
				<img className='w-[130px]' src={src} alt='' />
				<div className='Stampfont flex flex-col items-center text-[16px] mt-[10px]'>
					<span className=''>{booth.name}</span>
				</div>
			</button>
		);
	});

	return (
		<div id='stampmain' className='relative'>
			<div className='grid grid-cols-2 gap-x-0.5 gap-y-0.5 place-content-between mx-[20px] my-[40px] bg-[#F2F2F2] Mainfont text-[20px]'>
				{newBooth}
			</div>
		</div>
	);
};

export default Stampmain;
