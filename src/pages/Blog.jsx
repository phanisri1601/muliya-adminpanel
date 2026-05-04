import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, FileText, Image, Edit, Trash2, Upload, X, Save } from 'lucide-react';
import './Blog.css';

const STORAGE_KEY = 'blog_posts_v1';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const initialBlogPosts = [
  {
    id: '1',
    title: 'Free hair donation camp on September 11 for cancer sufferers by "Seeds of Hope"',
    description: 'Join us for a meaningful cause as Seeds of Hope organizes a free hair donation camp for cancer sufferers on September 11. This initiative aims to provide wigs and hairpieces to those who have lost their hair due to cancer treatments, helping them regain confidence and hope during their journey.',
    image: '',
    metaTitle: 'Free Hair Donation Camp for Cancer Sufferers | Seeds of Hope',
    metaDescription: 'Seeds of Hope organizes free hair donation camp on September 11 for cancer patients. Join us in this noble cause to provide wigs and support.',
    metaKeywords: 'hair donation, cancer, seeds of hope, charity, wig donation',
    createdAt: new Date('2022-09-06').getTime(),
    updatedAt: new Date('2022-09-06').getTime(),
  },
  {
    id: '2',
    title: 'Muliya Jewels Founder\'s day – Social Responsibility on the path of Excellence',
    description: '"The will to win, the desire to succeed, the urge to reach your full potential… These are the keys that will unlock the door to excellence," says the famous philosopher Confucius. This desire to be the best in the business is what has made Muliya jewels the prodigy that it is today. With over 5 stores spread across the lengths of Karnataka, Muliya jewels has brought smiles in the faces of lakhs of satisfied customers. World-class, state of an art stores, impeccable jewellery designs, customer-centric business policies and 74 years of Trust are a few pillars which hold together the legacy of Muliya Jewells. The foundation to this franchise was laid by one visionary leader, Sri Muliya Keshava Bhatta in 1944 in the small town of Puttur.\n\nSri Muliya Keshawa Bhatta, who hailed from a family of agricultural background, started the jewellery business with a desire to succeed and excel. It is because of his vision and principles that Muliya jewels has now grown out to be the single most promising name for Quality and Service in the Gold and Diamond Jewellery Industry. At Muliya jewels we take pride in reminiscing about our origins, celebrating our legacies and giving it back to the society which has made us what we are today.\n\nAt Muliya jewels, this legacy of our founding father is relived and remembered by celebrating the \'Founder\'s day.\' These celebrations are not just about reliving our legacy, but in fact a reminder about the things that we need to accomplish and the values that we need to imbibe from our founders to continue to succeed and evolve as a business.\n\nOne of the core principles of Muliya Jewels is to give it back to the society that has made us successful. The occasion of founder\'s day is the best way to help those who have been a part of our journey. On the occasion of founder\'s day celebrations, Rs. 25 per gram gold purchased on 7th, 8th and 9th will be donated to orphans, poor, needy, children and the aged, out of each and every customer\'s business. We invite you to be a part of this celebrations.\n\nCome join us as we reminisce about our Legacy and history.',
    image: '',
    metaTitle: 'Muliya Jewels Founder\'s Day - Social Responsibility & Excellence',
    metaDescription: 'Celebrating 74 years of trust and excellence at Muliya Jewels. Join our Founder\'s Day celebrations and contribute to social responsibility initiatives.',
    metaKeywords: 'Muliya Jewels, Founder\'s Day, social responsibility, excellence, trust, legacy',
    createdAt: new Date('2020-02-24').getTime(),
    updatedAt: new Date('2020-02-24').getTime(),
  },
  {
    id: '3',
    title: 'Why purchasing gold on Akshaya Tritiya is considered as a good fortune?',
    description: 'Akshaya Tritiya is the festival, which is considered as a Golden Day for Hindus and Jains. The word "Akshaya" means "imperishable, eternal, the never diminishing". This is a day when goddess of fortune showers her best blessings on people.\n\nAkshaya Tritiya is a very popular festival that the Hindus and Jains celebrate every year. It is considered as one of the most important day for Hindu community as Lord Parashurama (6th Avatar of Lord Vishnu) took birth on this day. The Hindu community considers this day as a lucky day and believes that any venture such as a business or the construction of a building started on that day will follow betterment and prosperity. Akshaya Tritiya is a one day event celebrated in late April or early May. Hindus celebrate this day because, according to them, Akshaya Tritiya is the day when the great God of Wisdom, Lord Ganapathi, started writing the epic work called "Mahabharata". It is believed that when the Pandavas were in exile the Lord Krishna presented them a bowl which was named Akshaya Pathra. That bowl was never empty and produces an unlimited amount of food on demand.\n\nThis is the day when Sudama (Krishna\'s best friend i.e., Kuchela) offered "Aval" to Lord Krishna and got a bounty of wealth through the grace of Krishna. This is the day, Pandavas received Akshaya Pathra (bowl) from Lord Krishna and thus were able to get unlimited food when the 400 plus sages visited their place during their exile. On this day the Gange (a holy river in India) came to Earth to purify mankind.\n\nAkshaya Tritiya is considered as a golden day of the year because any initiative made on that day or anything bought on that day is considered to be good fortune. The most popular activity is buying of gold and it is believed that it is a sign of good fortune for the buyer. This is also one of the most popular days for weddings to take plans as the spirit of this day bids them on a very long and fulfilling life journey. It was also believed that people born in that month will be very lucky and will shine bright throughout their life.\n\nAny good deed done on this day is never wasted. People buy gold on this day and gift each other. If you get something on this day, it will always grow. You gift, or you buy, it all grows. That is the belief. If not jewelry, many people simply buy small gold coins with Goddess Lakshmi engraved on them.',
    image: '',
    metaTitle: 'Why Purchase Gold on Akshaya Tritiya - Good Fortune & Tradition',
    metaDescription: 'Learn why buying gold on Akshaya Tritiya is considered auspicious and brings good fortune. Discover the cultural significance and traditions.',
    metaKeywords: 'Akshaya Tritiya, gold purchase, good fortune, Hindu festival, auspicious day, gold investment',
    createdAt: new Date('2020-02-21').getTime(),
    updatedAt: new Date('2020-02-21').getTime(),
  },
  {
    id: '4',
    title: 'Enhance Your Beauty with Traditional Jewellery',
    description: 'Jewellery has a great importance, specially for women. Women have been for ages decorated themselves with various metals in articulate style. India has a rich tradition of jewellery, and the style of jewellery varies from region to region. Each state has a special brand of jewellery that is traditionally worn by their people. Likewise, Coorg in Karnataka, has a distinct style of jewellery, which is becoming popular and is in demand.\n\nMuliya jewellers specializes in Coorg Traditional Jewellery, that has its own speciality and significance. Coorg Jewellery designs are based on nature, and inspirations are drawn from natural surroundings and objects like sun, moon, stars, serpents, fruits and flowers. The designs are very beautifully carved, making the piece distinctive. Coorg Jewellery ismade of both gold and silver with addition of stones like rubies and pearls.\n\nLet us discuss some important Coorg Traditional Jewellery, wornby a bride.\n\nKarthmani – it is a neck piece worn by married women and is made of black beads strewn on a gold chain string. This piece is made of very little gold as about 2 grams, not long enough but a little low on neck. This can be used as daily wear as its very light and comfortable.\n\nPathak – is also a piece worn by married women. It is a neckpiece, stringed by gold and coral beads combined with black glass beads, has a large gold coin in centre, embossed by either image of queen Victoria or goddess Lakshmi, surrounded by Rubies, crowned by a cobra with dangling natural water pearls.This piece being a bit heavy is usually used for occasions and festivals.\n\nJomale – is a fancy neckpiece 71cms long, made of round gold bead filled with lac and strung in black cord. It is an important part of Coorg bride jewellery, which the bride needs to wear. This is a very fashionable piece, which has taken to modern route by being strung not by black thread, but different coloured thread, which gives it a unique character.\n\nThe jewellery signifies wealth and fertility; hence the pendant embodies the symbol-i.e., seated Goddess of wealth-Lakshmi, surrounded by birds and a cobra with inflated head. The length of the chain is 26 inches, that falls pretty good around the neck for a fine show above the saree.\n\nCoorg Bangles or Kadagas – bracelet stacks or multiple sets of bracelet or bangles have become the latest trend. But Coorg Traditional Jewellery, has this latest trend already in its kitty. Coorg Bangles are made of gold that is hollow inside and can be made in stacks of 2-3 bands of gold that fastens around the wrist. The bangles are embellished with rubies and twisted gold wires, which looks extremely beautiful and trendy.\n\nPaunchi – another form of Coorg Bangles, is an exclusive endeavour of art. It has 2/3 cycle of repetitive rounds of gold grains that looks awesome when worn. Pimbale and Pirable are Coorg Bangles, made of gold in relatively simple design. Another form- Vajrachudi, whose design resembles the pointed look of jackfruit. As we see the Coorg Traditional Jewellery is inspired by nature, hence we see the replicas of nature in their design.\n\nJadaenagara – or the head ornament or maang tikka, consists of a head piece with three strands called- suryamukhi, chandramukhi, and kutchu made of 3 strings of black thread decorated with gold, to hold the headpiece in place. The head piece usually has depiction of Shiva and Parvathy with Ganesha, symbolising happy married life and fertility.\n\nThe foot jewellery – special emphasis is given to decorate the foot of the bride. The foot jewellery is made of silver with a native iconic artistry, that has rings on all fingers laced with chains attach to the anklet.\n\nBrooch – is animportant accessory of Coorg Jewellery. The way the women of Coorg drape the saree the brooch becomes an essential part of jewellery like jhumkas, which are made of gold, rubies and pearls.\n\nThe speciality of Coorg Jewellery is its making, which is slightly different from the other jewellery making. Coorg Traditional Jewellery use modest metal and beat it to make it paper thin, that gives a 3-dimensional effect and heaviness to the jewellery.\n\nMuliya jewellers, one of the best for Coorg Traditional Jewellery, has been in the business since independence, but are in Bangalore since 2012, with their same trademark of authenticity and individual and matchless designs.',
    image: '',
    metaTitle: 'Enhance Your Beauty with Traditional Coorg Jewellery | Muliya Jewellers',
    metaDescription: 'Discover the beauty of traditional Coorg jewellery including Karthmani, Pathak, Jomale, Kadagas and more. Expert craftsmanship at Muliya Jewellers.',
    metaKeywords: 'Coorg jewellery, traditional jewellery, Karthmani, Pathak, Jomale, Coorg bangles, Muliya jewellers, Karnataka jewellery',
    createdAt: new Date('2020-02-21').getTime(),
    updatedAt: new Date('2020-02-21').getTime(),
  },
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (stored && stored.length > 0) {
      setPosts(stored);
    } else {
      setPosts(initialBlogPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBlogPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPost) {
      setPosts(prev =>
        prev.map(post =>
          post.id === editingPost.id
            ? { ...post, ...formData, updatedAt: Date.now() }
            : post
        )
      );
    } else {
      const newPost = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setPosts(prev => [newPost, ...prev]);
    }

    closeModal();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      image: post.image,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const openModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="blog-container animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="blog-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <button className="button" onClick={openModal}>
          <Plus size={18} />
          Create New Blog
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="glass-panel blog-empty">
          <FileText size={48} />
          <h3>No blog posts yet</h3>
          <p>Create your first blog post to get started</p>
          <button className="button" onClick={openModal}>
            <Plus size={18} />
            Create New Blog
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="glass-panel blog-empty">
          <Search size={48} />
          <h3>No results found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="blog-grid">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="glass-panel blog-card animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="blog-card-image">
                {post.image ? (
                  <img src={post.image} alt={post.title} />
                ) : (
                  <div className="blog-image-placeholder">
                    <Image size={32} />
                  </div>
                )}
              </div>
              <div className="blog-card-content">
                <h4 className="blog-card-title">{post.title}</h4>
                <p className="blog-card-description">
                  {post.description.length > 120
                    ? `${post.description.substring(0, 120)}...`
                    : post.description}
                </p>
                <div className="blog-card-meta">
                  <span className="blog-date">{formatDate(post.createdAt)}</span>
                  <div className="blog-card-actions">
                    <button className="icon-button small" onClick={() => handleEdit(post)} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="icon-button small danger" onClick={() => handleDelete(post.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="blog-modal-overlay" onClick={closeModal}>
          <div className="blog-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <h3>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
              <button className="icon-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="blog-form">
              <div className="blog-form-content">
                <div className="form-section">
                  <h4>Blog Content</h4>

                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter blog description"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Blog Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />

                    {formData.image ? (
                      <div className="blog-image-preview">
                        <img src={formData.image} alt="Blog preview" />
                        <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="blog-image-upload"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={20} />
                        <span>Upload Image</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-section">
                  <h4>SEO Metadata</h4>

                  <div className="form-group">
                    <label htmlFor="metaTitle">Meta Title</label>
                    <input
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="Enter meta title for SEO"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="metaDescription">Meta Description</label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="Enter meta description for SEO"
                      rows={2}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="metaKeywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="metaKeywords"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleInputChange}
                      placeholder="Enter keywords separated by commas"
                    />
                  </div>
                </div>
              </div>

              <div className="blog-modal-footer">
                <button type="button" className="button outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  <Save size={16} />
                  {editingPost ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
