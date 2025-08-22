import { tgd, space, futurePioneers, robogenius,ieee, teatro } from "./index";

export const clubs = [
    {
        id:1,
        name:"The great Debaters",
        description:"the club great debaters is a club that focuses on enhancing the debating skills of its members, and provides a platform for students to engage in constructive discussions and debates.",
        instagram_link:"fake_link",
        linkedin_link:"fake_link",
        logo:tgd,
        created_date:"fake_date",
        views:3,
        likes:10,
        categories:["debate","communication", "public speaking"],
        short_video:"fake_link"
    },
    {
        id:2,
        name:"Space",
        description:"the club space explorers is a club that focuses on enhancing the knowledge and skills of its members in the field of space exploration and astronomy.",
        instagram_link:"fake_link",
        linkedin_link:"fake_link",
        logo:space,
        created_date:"fake_date",
        views:1,
        likes:4,
        categories:["astronomy","exploration", "space"],
        short_video:"fake_link"
    },
    {
        id:3,
        name:"Future Pioneers",
        description:"Future Pioneers is a student-led club focused on social impact through community initiatives and outreach campaigns, especially in rural areas. We organize projects, drives, and partnerships to support people in need and empower local communities.",
        instagram_link:"fake_link",
        linkedin_link:"fake_link",
        logo:futurePioneers,
        created_date:"fake_date",
        views:3,
        likes:10,
        categories:["social impact", "community", "outreach"],
        short_video:"fake_link"
    },
    {
        id:4,
        name:"Robot Genius",
        description:"The club robot genius is a club that focuses on enhancing the knowledge and skills of its members in the field of robotics and automation.",
        instagram_link:"fake_link",
        linkedin_link:"fake_link",
        logo:robogenius,
        created_date:"fake_date",
        views:1,
        likes:4,
        categories:["robotics","automation", "technology"],
        short_video:"fake_link"
    },
    {
        id:5,
        name:"IEEE",
        description:"The IEEE (Institute of Electrical and Electronics Engineers) is a professional association dedicated to advancing innovation and technological excellence for the benefit of humanity.",
        instagram_link:"fake_link",
        linkedin_link:"fake_link",
        logo:ieee,
        created_date:"fake_date",
        views:1,
        likes:4,
        categories:["engineering","technology", "innovation"],
        short_video:"fake_link"
    },
    {
        id:6,
        name:"Theatro",
        description:"Theatro is a club that focuses on enhancing the knowledge and skills of its members in the field of theater and performing arts.",
        instagram_link:"fake_link",
        linkedin_link:"fake_link",
        logo:teatro,
        created_date:"fake_date",
        views:1,
        likes:4,
        categories:["theater","performing arts"],
        short_video:"fake_link"
    }
];

export const clubsDetailsData =[ 

    {
        id:5,
        name:"IEEE",
        admin:1,
        description:"The IEEE ENSAF Student Branch is the official branch of the Institute of Electrical and Electronics Engineers (IEEE) at the École Nationale des Sciences Appliquées de Fès (ENSAF), Morocco.\n Founded in 2019, this student branch is part of the global IEEE network  the world’s largest professional association dedicated to advancing technology for humanity.",
        facebook_link:"https://www.facebook.com/ieee.ensaf",
        instagram_link:"https://www.instagram.com/ieee_ensaf",
        linkedin_link:"https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A71737460&keywords=ieee%20ensaf%20student%20branch&origin=RICH_QUERY_SUGGESTION&position=1&searchId=bbbad912-e1e4-46fe-b69e-11f03c7183ae&sid=tqc&spellCorrectionEnabled=false",
        logo:ieee,
        created_date:"2019",
        short_video:"/ieee_data/ieee_video.mp4",
        club_images:[
            "/ieee_data/ieee_image_1.jpg"
            ,"/ieee_data/ieee_image_2.webp",
            "/ieee_data/ieee_image_3.jpg",
            "/ieee_data/ieee_image_4.webp"
        ],
        activities:[
            {
                id:1,
                name:"IEEE R8 ENTREPRENEURSHIP EVENT",
                pitch:"IEEE R8 Entrepreneurship Day brought together innovators, entrepreneurs, and problem-solvers for a day filled with insightful workshops, thrilling competitions, and inspiring connections! \n⚡💡📜A huge thank you to all the participants, speakers, and organizers who made this event a success! 🚀🏆 Let’s keep the momentum going and shape the future together! 🔥💼",
                activity_date:"2025-02-22",
                activity_images:[
                    "/ieee_data/r8_entrepren_1.jpg",
                    "/ieee_data/r8_entrepren_2.jpg",
                    "/ieee_data/r8_entrepren_3.jpg",
                    "/ieee_data/r8_entrepren_4.jpg",
                    "/ieee_data/r8_entrepren_5.jpg",
                ],
                main_image:"/ieee_data/main_r8_entrepre.jpg"
            },
            {
                id:2,
                name:"IEEE SPAx",
                pitch:"Fes vibrated with innovation on May 11th, 2024, as the inaugural IEEE SPAX event, “Let’s Innovate Together,” took center stage! This groundbreaking one-day conference united brilliant minds from tech, engineering, healthcare, and automotive industries ⚙️. It provided a fantastic platform for sharing ideas and solutions that will shape tomorrow .\n The event dazzled with engaging tech talks on cutting-edge trends and future possibilities in these dynamic fields . Attendees also enjoyed stellar networking opportunities, forging connections with fellow innovators and industry titans ✨. “Let’s Innovate Together” transcended a conference; it was a vibrant hub of inspiration, highlighting the power of collaboration in building a sustainable future for all . This phenomenal event sets a promising tone for fostering innovation across diverse sectors in Morocco and beyond!",
                activity_date:"2024-05-11",
                activity_images:[
                    "/ieee_data/spax_1.jpg",
                    "/ieee_data/spax_2.jpg",
                    "/ieee_data/spax_3.jpg",
                    "/ieee_data/spax_4.jpg",
                ],
                main_image:"/ieee_data/spax _main.heic"
            },
            {
                id:3,
                name:"Tech-Driven solutions for a Sustainable future",
                pitch:"Join us for the IEEE Innovation Summit, where technology meets creativity! This event will showcase groundbreaking ideas and solutions from the brightest minds in the industry. Don't miss your chance to be part of the future!",
                activity_date:"2024-09-15",
                activity_images:[
                    "/",
                    "/",
                ],
                main_image:"/ieee_data/tech_main.jpg"
            }
        ],
        board_members:[
            {
                board_member_id:1,
                fullname:"Mariam Daoudi",
                email:"",
                image:"/ieee_data/board_members/mariam_daoudi.heic",
                role:"Chair",
            },
            {
                board_member_id:2,
                fullname:"Hajar Idrissi Azami",
                email:"",
                image:"/ieee_data/board_members/hajar.heic",
                role:"Vice Chair",
            },
            {
                board_member_id:3,
                fullname:"Salma Fagousse",
                email:"",
                image:"/ieee_data/board_members/salma.heic",
                role:"Secretary",
            },
            {
                board_member_id:4,
                fullname:"Ghita Maski",
                email:"",
                image:"/ieee_data/board_members/ghita.heic",
                role:"Treasurer",
            },
            {
                board_member_id:5,
                fullname:"Salah Eddine Janati",
                email:"",
                image:"/ieee_data/board_members/salah.heic",
                role:"Media Chair",
            },
            {
                board_member_id:6,
                fullname:"Ahlam Boumehdi",
                email:"",
                image:"/ieee_data/board_members/ahlam.heic",
                role:"Program Chair",
            },
            {
                board_member_id:7,
                fullname:"Meryem Kada",
                email:"",
                image:"/ieee_data/board_members/kada.heic",
                role:"Design Chair",
            }

        ],
        reviews:[
            {
                review:1,
                full_name:"yassine ben kacem",
                email:"yassine@example.com",
                text:"the ieee club rocks!",
                date:"2024-03-20"
            },
            {
                review:2,
                full_name:"ahmed karimi",
                email:"ahmed@example.com",
                text:"the ieee club is amazing!",
                date:"2024-03-21"
            },
            {
                review:3,
                full_name:"hind boukhris",
                email:"mohamed@example.com",
                text:"the ieee club is fantastic!",
                date:"2024-03-22"
            },
            {
                review:4,
                full_name:"mohamed boukhrta",
                email:"mohamed@example.com",
                text:"the ieee club is awesome!",
                date:"2024-03-23"

            }
        ]
    },
    {
        id:1,
        name:"Space Club",
        description:"A club for space enthusiasts",
        members:[
            {
                member_id:1,
                fullname:"",
                email:"",
                image:""
            },
            {
                member_id:2,
                fullname:"",
                email:"",
                image:""
            }
        ],
        reviews:[
            {
                review:1,
                full_name:"",
                email:"",
                text:"",
                date:""
            },
            {
                review:2,
                full_name:"",
                email:"",
                text:"",
                date:""
            },
            {
                review:3,
                full_name:"",
                email:"",
                text:"",
                date:""
            },
            {
                review:4,
                full_name:"",
                email:"",
                text:"",
                date:""
            }
        ],
        activities:[
            {
                activity_id:1,
                title:"Stargazing Night",
                description:"Join us for a night under the stars!",
                date:"2024-04-01"
            },
            {
                activity_id:2,
                title:"Rocket Launch Simulation",
                description:"Experience the thrill of launching a rocket.",
                date:"2024-04-15"
            }
        ]
    },
    {
        
    }
]