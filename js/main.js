/**
 * ============================================================================
 * LED Display Pro - 主JavaScript文件
 * ============================================================================
 * 
 * 功能模块:
 * 1. 移动端导航菜单
 * 2. 吸顶头部导航
 * 3. 平滑滚动
 * 4. 返回顶部按钮
 * 5. 滚动动画
 * 6. 产品筛选
 * 7. 表单处理
 * 8. 读取进度条
 * 9. 计数器动画
 * 10. 图片懒加载
 * 
 * @package LED Display Pro
 * @version 1.0.0
 */

(function() {
    'use strict';

    /**
     * 主应用对象
     */
    const App = {
        
        /**
         * 初始化所有功能
         */
        init: function() {
            this.cacheDom();
            this.bindEvents();
            this.initScrollAnimations();
            this.initCounterAnimation();
            this.initLazyLoading();
            
            // 移除预加载状态
            document.body.classList.add('loaded');
        },

        /**
         * 缓存DOM元素
         */
        cacheDom: function() {
            // 导航相关
            this.menuToggle = document.querySelector('.menu-toggle');
            this.mainNav = document.querySelector('.main-nav');
            this.siteHeader = document.querySelector('.site-header');
            this.navLinks = document.querySelectorAll('.main-nav a');
            
            // 按钮
            this.backToTopBtn = document.querySelector('.back-to-top');
            
            // 表单
            this.contactForm = document.getElementById('contact-form');
            this.newsletterForm = document.querySelector('.newsletter-form');
            
            // 产品筛选
            this.productTabs = document.querySelectorAll('.product-tab');
            this.productCards = document.querySelectorAll('.product-card');
            
            // 动画元素
            this.animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
            
            // 计数器
            this.counters = document.querySelectorAll('.stat-number[data-count]');
            
            // 读取进度条
            this.progressBar = document.querySelector('.progress-bar');
        },

        /**
         * 绑定事件
         */
        bindEvents: function() {
            // 移动端菜单切换
            if (this.menuToggle) {
                this.menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
            }
            
            // 点击导航链接关闭菜单
            this.navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (window.innerWidth < 768) {
                        App.closeMobileMenu();
                    }
                });
            });
            
            // 点击页面其他地方关闭菜单
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.main-nav') && !e.target.closest('.menu-toggle')) {
                    App.closeMobileMenu();
                }
            });
            
            // 滚动事件
            window.addEventListener('scroll', this.handleScroll.bind(this));
            
            // 窗口大小改变
            window.addEventListener('resize', this.handleResize.bind(this));
            
            // 返回顶部
            if (this.backToTopBtn) {
                this.backToTopBtn.addEventListener('click', this.scrollToTop.bind(this));
            }
            
            // 产品筛选
            this.productTabs.forEach(function(tab) {
                tab.addEventListener('click', App.filterProducts.bind(App));
            });
            
            // 联系表单
            if (this.contactForm) {
                this.contactForm.addEventListener('submit', this.handleContactForm.bind(this));
            }
            
            // 订阅表单
            if (this.newsletterForm) {
                this.newsletterForm.addEventListener('submit', this.handleNewsletterForm.bind(this));
            }
        },

        /**
         * 切换移动端菜单
         */
        toggleMobileMenu: function() {
            this.menuToggle.classList.toggle('active');
            this.mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // 更新ARIA属性
            const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
            this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        },

        /**
         * 关闭移动端菜单
         */
        closeMobileMenu: function() {
            if (this.menuToggle) {
                this.menuToggle.classList.remove('active');
            }
            if (this.mainNav) {
                this.mainNav.classList.remove('active');
            }
            document.body.classList.remove('menu-open');
        },

        /**
         * 处理滚动事件
         */
        handleScroll: function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 吸顶头部
            this.handleStickyHeader(scrollTop);
            
            // 返回顶部按钮
            this.handleBackToTopButton(scrollTop);
            
            // 读取进度条
            this.updateReadingProgress();
            
            // 滚动动画
            this.checkScrollAnimations();
        },

        /**
         * 处理吸顶头部
         */
        handleStickyHeader: function(scrollTop) {
            if (this.siteHeader) {
                if (scrollTop > 100) {
                    this.siteHeader.classList.add('scrolled');
                } else {
                    this.siteHeader.classList.remove('scrolled');
                }
            }
        },

        /**
         * 处理返回顶部按钮
         */
        handleBackToTopButton: function(scrollTop) {
            if (this.backToTopBtn) {
                if (scrollTop > 300) {
                    this.backToTopBtn.classList.add('visible');
                } else {
                    this.backToTopBtn.classList.remove('visible');
                }
            }
        },

        /**
         * 滚动到顶部
         */
        scrollToTop: function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },

        /**
         * 处理窗口大小改变
         */
        handleResize: function() {
            if (window.innerWidth >= 768) {
                this.closeMobileMenu();
            }
        },

        /**
         * 初始化滚动动画
         */
        initScrollAnimations: function() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                this.animatedElements.forEach(function(el) {
                    observer.observe(el);
                });
            } else {
                // 降级处理：直接显示所有元素
                this.animatedElements.forEach(function(el) {
                    el.classList.add('visible');
                });
            }
        },

        /**
         * 检查滚动动画
         */
        checkScrollAnimations: function() {
            this.animatedElements.forEach(function(el) {
                if (App.isElementInViewport(el)) {
                    el.classList.add('visible');
                }
            });
        },

        /**
         * 检查元素是否在视口中
         */
        isElementInViewport: function(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
                rect.bottom >= 0
            );
        },

        /**
         * 产品筛选
         */
        filterProducts: function(e) {
            const tab = e.currentTarget;
            const filter = tab.getAttribute('data-filter');
            
            // 更新活动标签
            this.productTabs.forEach(function(t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            // 筛选产品
            this.productCards.forEach(function(card) {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        },

        /**
         * 初始化计数器动画
         */
        initCounterAnimation: function() {
            if (!this.counters.length) return;
            
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            App.animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.5
                });

                this.counters.forEach(function(counter) {
                    observer.observe(counter);
                });
            }
        },

        /**
         * 计数器动画
         */
        animateCounter: function(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(function() {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        },

        /**
         * 更新读取进度条
         */
        updateReadingProgress: function() {
            if (!this.progressBar) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / docHeight) * 100;
            
            this.progressBar.style.width = progress + '%';
        },

        /**
         * 初始化懒加载
         */
        initLazyLoading: function() {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            if (!lazyImages.length) return;
            
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.getAttribute('data-src');
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                });

                lazyImages.forEach(function(img) {
                    observer.observe(img);
                });
            } else {
                // 降级处理
                lazyImages.forEach(function(img) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                });
            }
        },

        /**
         * 处理联系表单
         */
        handleContactForm: function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const formData = new FormData(form);
            
            // 禁用提交按钮
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // 模拟表单提交
            setTimeout(function() {
                // 显示成功消息
                form.innerHTML = `
                    <div class="success-message" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--color-success); margin-bottom: 1rem;"></i>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent successfully. We will get back to you within 24 hours.</p>
                    </div>
                `;
                
                // 滚动到成功消息
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        },

        /**
         * 处理订阅表单
         */
        handleNewsletterForm: function(e) {
            e.preventDefault();
            
            const form = e.target;
            const emailInput = form.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                form.innerHTML = '<p class="success-text" style="color: var(--color-success);"><i class="fas fa-check"></i> Thank you for subscribing!</p>';
            }
        }
    };

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            App.init();
        });
    } else {
        App.init();
    }

    /**
     * 平滑滚动到指定元素
     */
    window.smoothScrollTo = function(target, offset) {
        offset = offset || 80;
        const element = document.querySelector(target);
        
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    /**
     * 为所有平滑滚动链接添加事件
     */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#0') {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });

})();
