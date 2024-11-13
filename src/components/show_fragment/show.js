'use client';

import React, { useState, useEffect } from 'react';
import { getUser } from '../../auth';
import { getFragments } from '@/helpers/get_fragment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Trash, RefreshCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { deleteFragment } from '@/helpers/delete_fragment';
import { updateFragment } from '@/helpers/update_fragment';

export default function Show() {
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [updatedData, setUpdatedData] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await getUser();
      if (!userData) {
        setError('User not logged in');
      } else {
        const userFragments = await getFragments(userData);
        setFragments(userFragments);
        setUser(userData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFragment(selectedFragment.id, user);
      setIsDeleteModalOpen(false);
      fetchUserData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateFragment(
        selectedFragment.id,
        user,
        updatedData,
        selectedFragment.type
      );
      setIsUpdateModalOpen(false);
      fetchUserData();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderFragmentData = (fragment) => {
    switch (fragment.type) {
      case 'text/plain':
      case 'text/markdown':
      case 'text/html':
        return (
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {fragment.data}
          </pre>
        );
      case 'application/json':
        return (
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(fragment.data, null, 2)}
          </pre>
        );
      case 'application/yaml':
        return (
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {fragment.data}
          </pre>
        );

      case 'text/csv':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {fragment.data
                  .split('\n')
                  .filter((row) => row.trim() !== '')
                  .map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      {row.split(',').map((cell, j) => (
                        <td
                          key={j}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );
      case 'image/png':
      case 'image/jpeg':
      case 'image/webp':
      case 'image/gif':
      case 'image/avif':
        return (
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(fragment.data)}
              alt={`Fragment ${fragment.id}`}
              className="max-w-full h-auto"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>
        );
      default:
        return <p>Unsupported fragment type</p>;
    }
  };

  const renderUpdateForm = () => {
    switch (selectedFragment?.type) {
      case 'text/plain':
      case 'text/markdown':
      case 'text/html':
      case 'application/yaml':
      case 'text/csv':
        return (
          <Textarea
            value={updatedData}
            onChange={(e) => setUpdatedData(e.target.value)}
            placeholder="Enter updated data"
            className="mt-2"
          />
        );
      case 'application/json':
        return (
          <Textarea
            value={JSON.stringify(updatedData, null, 2)}
            onChange={(e) => {
              try {
                const parsedData = JSON.parse(e.target.value);
                setUpdatedData(parsedData); 
              } catch (error) {
                setUpdatedData(e.target.value);
              }
            }}
            placeholder="Enter updated data"
            className="mt-2"
          />
        );
      case 'image/png':
      case 'image/jpeg':
      case 'image/webp':
      case 'image/gif':
      case 'image/avif':
        return (
          <Input
            type="file"
            accept={selectedFragment.type}
            onChange={(e) => setUpdatedData(e.target.files[0])}
            className="mt-2"
          />
        );
      default:
        return <p>Unsupported fragment type for update</p>;
    }
  };

  if (loading)
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="w-[250px] h-[20px] rounded-full mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="w-[150px] h-[20px] rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-[100px] rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              fragment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Fragment</DialogTitle>
            <DialogDescription>
              Update the content of your fragment.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="fragmentData">New Fragment Data</Label>
            {renderUpdateForm()}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className="text-3xl font-bold mb-6">Your Fragments</h1>
      <div className="space-y-6">
        {console.log(fragments)}
        {fragments.map((fragment) => (
          <Card key={fragment.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">
                Fragment ID: {fragment.id}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <p>
                  <strong>Owner ID:</strong> {fragment.ownerId}
                </p>
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(fragment.created).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong>{' '}
                  {new Date(fragment.updated).toLocaleString()}
                </p>
                <p>
                  <strong>Type:</strong> {fragment.type}
                </p>
                <p>
                  <strong>Size:</strong> {fragment.size} bytes
                </p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Data:</h3>
                  <div className="p-4 bg-gray-200 rounded-md overflow-hidden">
                    {renderFragmentData(fragment)}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFragment(fragment);
                      setUpdatedData(fragment.data);
                      setIsUpdateModalOpen(true);
                    }}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedFragment(fragment);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
