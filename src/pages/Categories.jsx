import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Switch,
  Form,
  Input,
  Upload,
  message,
} from 'antd';
import { UploadOutlined, DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { Search } from 'lucide-react';
import { api, endpoints, IMAGE_BASE_URL } from '../api';
import { compressImageForUpload } from '../utils/imageCompress';
import './Categories.css';

const { confirm } = Modal;

/** Matches other admin calls (e.g. add category / inventory `lang=1`). */
const CATEGORY_LANG = '1';

const EXCLUDED_FORM_KEYS = ['_id', 'createdBy', 'createdAt', '__v', 'lang', 'updatedAt'];

const EMPTY_CATEGORY = {
  name: '',
  description: '',
  imageUrl: '',
  category_img_desktop: '',
  category_img_mobile: '',
  isActive: true,
};

function toFormImage(path) {
  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${IMAGE_BASE_URL}${clean}`;
}

function formatDisplayDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function CustomImageUpload({ value, onChange }) {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!value) {
      setFileList([]);
      return;
    }
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setFileList([
        {
          uid: '1',
          name: value.name,
          status: 'done',
          originFileObj: value,
          url,
        },
      ]);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof value === 'string' && value) {
      setFileList([{ uid: '-1', name: 'image', status: 'done', url: value }]);
    }
  }, [value]);

  const handleChange = ({ fileList: fl }) => {
    setFileList(fl);
    if (!fl.length) {
      onChange?.(null);
      return;
    }
    const raw = fl[0]?.originFileObj;
    if (raw) {
      onChange?.(raw);
    } else if (fl[0]?.url) {
      onChange?.(fl[0].url);
    }
  };

  return (
    <Upload
      accept=".jpg,.jpeg,.png"
      fileList={fileList}
      maxCount={1}
      customRequest={({ onSuccess }) => {
        setTimeout(() => onSuccess?.('ok'), 0);
      }}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />}>Upload Image</Button>
    </Upload>
  );
}

function EditModal({ open, data, onClose, onSave }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && data && typeof data === 'object') {
      form.setFieldsValue(data);
    }
  }, [open, data, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await onSave(values);
          form.resetFields();
          onClose();
        } catch {
          /* Parent shows error message; keep modal open. */
        }
      })
      .catch(() => {
        message.error('Please fix validation errors.');
      });
  };

  const entries = useMemo(() => {
    if (!data || typeof data !== 'object') return [];
    return Object.entries({ ...EMPTY_CATEGORY, ...data }).filter(
      ([key]) => !EXCLUDED_FORM_KEYS.includes(key)
    );
  }, [data]);

  const isEdit = Boolean(data?._id);

  return (
    <Modal
      title={isEdit ? 'Edit Category' : 'Add Category'}
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="categories-edit-form">
        <div className="categories-form-grid">
          {entries.map(([key, value]) => (
            <Form.Item
              className="categories-form-field"
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
              name={key}
              valuePropName={key === 'isActive' ? 'checked' : undefined}
              rules={
                key === 'name'
                  ? [{ required: true, message: 'Name is required' }]
                  : undefined
              }
            >
              {key === 'isActive' ? (
                <Switch size="small" />
              ) : ['imageUrl', 'category_img_desktop', 'category_img_mobile'].includes(key) ? (
                <CustomImageUpload />
              ) : (
                <Input />
              )}
            </Form.Item>
          ))}
        </div>
      </Form>
    </Modal>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ ...EMPTY_CATEGORY });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.categories);
      const normalized = res?.data ?? res?.Data ?? res?.result ?? res?.Result ?? res;
      const categoryList = Array.isArray(normalized)
        ? normalized
        : normalized?.categories || [];
      setCategories(categoryList);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      message.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return value.name ?? value.title ?? value.label ?? value._id ?? JSON.stringify(value);
    }
    return String(value);
  };

  const getImageUrl = (category) => {
    const imagePath = category.imageUrl || category.image;
    if (!imagePath) return null;
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Delete this category?',
      icon: <DeleteFilled />,
      content: `This will remove "${safeRender(record.name)}". This action cannot be undone.`,
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await api.delete(`${endpoints.categories}/${record._id}`);
          message.success('Category deleted.');
          await fetchCategories();
        } catch (error) {
          console.error(error);
          message.error('Failed to delete category.');
          throw error;
        }
      },
    });
  };

  const handleToggleActive = async (record, checked) => {
    try {
      const data = new FormData();
      data.append('name', record.name || '');
      data.append('description', record.description || '');
      data.append('isActive', String(checked));
      data.append('createdBy', localStorage.getItem('userId') || '1');
      data.append('lang', CATEGORY_LANG);
      await api.put(`${endpoints.putcategories}/${record._id}`, data);
      message.success('Status updated.');
      await fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('Failed to update active status.');
    }
  };

  const handleEdit = (record) => {
    setEditData({
      ...EMPTY_CATEGORY,
      ...record,
      imageUrl: toFormImage(record.imageUrl || record.image || ''),
      category_img_desktop: toFormImage(record.category_img_desktop || ''),
      category_img_mobile: toFormImage(record.category_img_mobile || ''),
    });
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setEditData({ ...EMPTY_CATEGORY });
    setEditModalOpen(true);
  };

  const appendFileIfNeeded = (formData, fieldName, value) => {
    if (value instanceof File) {
      formData.append(fieldName, value);
    }
  };

  const handleSaveEdit = async (edited) => {
    const [imageUrl, category_img_desktop, category_img_mobile] = await Promise.all([
      edited.imageUrl instanceof File ? compressImageForUpload(edited.imageUrl) : edited.imageUrl,
      edited.category_img_desktop instanceof File
        ? compressImageForUpload(edited.category_img_desktop)
        : edited.category_img_desktop,
      edited.category_img_mobile instanceof File
        ? compressImageForUpload(edited.category_img_mobile)
        : edited.category_img_mobile,
    ]);

    const formData = new FormData();
    formData.append('name', edited.name ?? '');
    formData.append('description', edited.description ?? '');
    formData.append('isActive', String(edited.isActive ?? true));
    formData.append('createdBy', localStorage.getItem('userId') || '1');
    formData.append('lang', CATEGORY_LANG);

    appendFileIfNeeded(formData, 'imageFile', imageUrl);
    appendFileIfNeeded(formData, 'ImgDesktop', category_img_desktop);
    appendFileIfNeeded(formData, 'ImgMobile', category_img_mobile);

    try {
      if (editData._id) {
        await api.put(`${endpoints.categories}/${editData._id}`, formData);
        message.success('Category updated.');
      } else {
        await api.post("https://muliya.ourapi.co.in/api/category/addcategories", formData);
        message.success('Category added.');
      }
      await fetchCategories();
    } catch (error) {
      console.error(error);
      message.error(
        error?.message ||
          (editData._id ? 'Failed to update category.' : 'Failed to add category.')
      );
      throw error;
    }
  };

  const filteredCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((category) => {
      const name = safeRender(category.name || category.category_name).toLowerCase();
      const id = safeRender(category._id || category.id).toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [categories, searchTerm]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => safeRender(text),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => safeRender(text),
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (_, record) => {
        const src = getImageUrl(record);
        if (!src) return '—';
        return (
          <img
            src={src}
            alt=""
            className="categories-table-thumb"
          />
        );
      },
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={Boolean(isActive)}
          size="small"
          onChange={(checked) => handleToggleActive(record, checked)}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => formatDisplayDate(createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="categories-table-actions">
          <Button
            type="default"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button danger size="small" onClick={() => showDeleteConfirm(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading && !categories.length) {
    return (
      <div className="categories-container animate-fade-in">
        <div className="loading-spinner-container">
          <div className="loading-spinner">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container animate-fade-in">
      <div className="categories-header">
        <h2 className="categories-title">Categories</h2>
        <div className="categories-actions-top">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="primary" className="add-category-btn" icon={<PlusOutlined />} onClick={handleAddClick}>
            Add Category
          </Button>
        </div>
      </div>

      <div className="glass-panel categories-panel categories-ant-table">
        <Table
          rowKey={(row) => row._id || row.id}
          loading={loading}
          dataSource={filteredCategories}
          columns={columns}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'No categories found' }}
        />
      </div>

      <EditModal
        open={editModalOpen}
        data={editData}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
