"use client"

import { clientService } from "@/hooks/clientService"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-tables"
import { useEffect, useState } from "react";
import { Client } from "@/types/models";
 
export default function DataTablesPage() {

  const [data, setData] = useState<Client[]>([]);
  const [query_params, setQueryParams] = useState<Record<string, any>>({ordering: "-created_at"});

  const fetchData = async () => {
    try {
      const clients = await clientService.getClients(query_params);
      setData(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleActiveFilterChange = (active: boolean | null) => {
    console.log("Active filter changed:", active);
    if (active === null) {
      const newParams = { ...query_params };
      delete newParams.active;
      setQueryParams(newParams);
    } else {
      setQueryParams({ ...query_params, active });
    }
  };

  useEffect(() => {
    fetchData();
  }, [query_params]);

  const addClient = (client: Client) => {
    console.log("Adding client:", client);
    setData(prevData => [client, ...prevData]);
  };

  const updateClient = (updatedClient: Client) => {
    setData(prevData => 
      prevData.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const removeClient = (deletedClient: Client) => {
    console.log("Removing client:", deletedClient);
    setData(prevData => 
      prevData.filter(client => client.id !== deletedClient.id)
    );
  };
  
  return (
    <div className="px-4">
      <DataTable 
        columns={columns} 
        data={data} 
        onChangeActiveFilter={handleActiveFilterChange} 
        onClientCreated={addClient} 
        onClientUpdated={updateClient} 
        onClientDeleted={removeClient} 
      />
    </div>
  )
}