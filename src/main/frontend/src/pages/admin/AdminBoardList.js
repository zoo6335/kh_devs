import Table from 'react-bootstrap/Table';
import './admin.css'
import styled from "styled-components";
import Adminheader from './Adminheader';
import { useEffect, useState } from 'react';
import AdminApi from '../../api/AdminApi';
import Loading from '../../utill/Loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import JwModal from '../../utill/JwModal';
import Pagination from 'react-js-pagination';


const Adcontainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
min-height: 100vh;
background: linear-gradient(90deg, #ffe7e8, #8da4d0);
font-family: 'Gowun Dodum', sans-serif;
`;

const PaginationBox = styled.div`
  .pagination { display: flex; justify-content: center; margin-top: 15px;}
  ul { list-style: none; padding: 0; }
  ul.pagination li {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #e2e2e2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem; 
  }
  ul.pagination li:first-child{ border-radius: 5px 0 0 5px; }
  ul.pagination li:last-child{ border-radius: 0 5px 5px 0; }
  ul.pagination li a { text-decoration: none; color: #9691db; font-size: 1rem; }
  ul.pagination li.active a { color: white; }
  ul.pagination li.active { background-color: #9691db; }
  ul.pagination li a:hover,
  ul.pagination li a.active { color: #4a4688; }
  `

function AdminBoardList() {

  const navigate = useNavigate();
  const params = useParams().studyId;
  const [adstudyboard, setAdstudyboard] = useState([]); // 스터디게시판 조회
  const [loading, setLoading] = useState(false);
  const [deleteAdBoard, setDeleteAdBoard] = useState(false); //멤버삭제
  const [modalOpen, setModalOpen] = useState(false);
  /// 페이지 네그네이션 
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(10); // 페이지별 목록 개수



  useEffect(() => {
    const BoardData = async () => {
      setLoading(true);
      try {
        const response = await AdminApi.adstudyboardList()
        setAdstudyboard(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
      
    };

    BoardData();
  }, []);

  // 페이지 네이션 이동
  const handlePageChange = (page) => { setPage(page); };
  const itemChange = (e) => {
    setItems(Number(e.target.value))

  }

console.log(items*(page-1), items*(page-1)+items)


  // 스터디 게시판 삭제
  const confirmModal = async (e) => {
    console.log("삭제 버튼 클릭");
    setModalOpen(true);
    const response = await AdminApi.deleteStudyBoard(e);
    console.log(response.data);
    if (response.data) {
      setLoading(true);
      setDeleteAdBoard(true);
      // navigate("/AdminBoardList")
      window.location.reload();
    } else setDeleteAdBoard(false);
    setLoading(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <Loading></Loading>;
  }


  return (
    <>
      <Adminheader></Adminheader>
      <Adcontainer>
        <div>
          <h1 className='adTitle'>스터디 게시판 리스트&nbsp;<i class="fi fi-rr-document"></i></h1> 
          <Table striped bordered hover size="sm" className='table_adboardlist'>
            <thead>
              <tr>
                <th>제목</th>
                <th>내용</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>생성시간</th>
                <th>모집현황</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {/* 페이지네이션 잘라내기 */}
              {adstudyboard.slice(
             items*(page-1),
             items*(page-1)+items
           ).
              map((list) => (
                  <tr key={list.id}>

                    <td>{list.title}</td>
                    <td>{list.content.substr(0, 7)}...</td>
                    <td>{list.writer}</td>
                    <td>{list.cnt}</td>
                    <td>{list.updateTime}</td>
                    <td>{list.coordinate}</td>
                    <td>
                      <>
                      <button className='adbutton delete' onClick={openModal} >삭제</button>
                      {modalOpen && <JwModal open={modalOpen} confirm={() => confirmModal(list.id)} close={closeModal} type={true} header="확인">정말 삭제하시겠습니까?</JwModal>}
                      </>
                      <Link to={`/study/${list.id}`} style={{ textDecoration: "none" , color : "inherit"}}><button className='adbutton serch' >조회</button></Link>
                      <button className='adbutton edit'>수정</button>
                      <button className='adbutton delete'>미정</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <PaginationBox>
        <Pagination
          activePage={page}
          itemsCountPerPage={items}
          totalItemsCount={adstudyboard.length-1}
          pageRangeDisplayed={10}
          onChange={handlePageChange}>
        </Pagination>
      </PaginationBox>
        </div>
      </Adcontainer>
      

    </>
  );
}

export default AdminBoardList;
