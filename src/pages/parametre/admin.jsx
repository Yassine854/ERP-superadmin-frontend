import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from '../../axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Admin() {
  const [admins, setAdmins] = useState([]);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/admins');
      setAdmins(response.data.admins);
      setPending(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleShowSliders = (row) => {
    navigate(`/parametres/${row._id}`, { state: { adminName: row.name } });
  };


  const columns = [
    {
      name: 'ID',
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: 'Nom',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleShowSliders(row)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
            Gérer Paramétres
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        border: 'none',
      },
    },
    headCells: {
      style: {
        color: '#202124',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        minHeight: '56px',
      },
      highlightOnHoverStyle: {
        backgroundColor: 'rgb(230, 244, 244)',
        borderBottomColor: '#FFFFFF',
        borderRadius: '25px',
        outline: '1px solid #FFFFFF',
      },
    },
    pagination: {
      style: {
        border: 'none',
      },
    },
  };

  return (
    <DataTable
      title="Admins"
      columns={columns}
      data={admins}
      customStyles={customStyles}
      highlightOnHover
      pointerOnHover
      pagination
      responsive
      progressPending={pending}
    />
  );
}
