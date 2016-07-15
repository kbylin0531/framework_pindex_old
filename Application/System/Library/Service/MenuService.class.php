<?php

/**
 * Created by PhpStorm.
 * User: lnzhv
 * Date: 7/15/16
 * Time: 12:05 PM
 */
namespace Application\System\Library\Service;
use PLite\Core\URL;

class MenuService {

    /**
     * @return array
     */
    public function getSideMenu(){
        return [
            [
                'icon'  => 'fa-list',
                'title' => '通用管理',
                'children'  => [
                    [
                        'url'   => URL::url('category'),
                        'title' => '栏目配置',
                    ],
                    [
                        'url'   => URL::url('news_mg',['start_catg'=>'news','style'=>1]),
                        'title' => '图文管理',
                    ],
                    [
                        'url'   => URL::url('product_mg',['start_catg'=>'product','style'=>1]),
                        'title' => '产品管理',
                    ],
                    [
                        'url'   => URL::url('adv_mg',['start_catg'=>'adv','style'=>2]),
                        'title' => '广告管理',
                    ],
                    [
                        'url'   => URL::url('feed_mg'),
                        'title' => '留言管理',
                    ],
                    [
                        'url'   => URL::url('file_mg'),
                        'title' => '文件管理',
                    ],
                ]
            ],
            [
                'icon'  => 'fa-list',
                'title' => '微信管理',
                'children'  => [
                    [
                        'url'   => URL::url('replytext_mg',['start_catg'=>'msg-1','style'=>1]),
                        'title' => '文本回复',
                    ],
                    [
                        'url'   => URL::url('replynews_mg',['start_catg'=>'msg-2','style'=>2]),
                        'title' => '图文回复',
                    ],
                    [
                        'url'   => URL::url('wxmenu_mg'),
                        'title' => '自定义菜单',
                    ],
                    [
                        'url'   => URL::url('adv_mg',['start_catg'=>'adv-3','style'=>2]),
                        'title' => '首页幻灯片',
                    ],
                    [
                        'url'   => URL::url('wxconfig'),
                        'title' => '微信设置',
                    ],
                ]
            ],
        ];
    }

}