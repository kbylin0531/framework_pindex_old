<?php
/**
 * Created by PhpStorm.
 * User: lnzhv
 * Date: 7/14/16
 * Time: 4:54 PM
 */
namespace Application\Admin\Controller;
use Application\System\Library\Service\LoginService;
use Application\System\Library\Service\MenuService;
use Application\System\Model\AccountModel;
use PLite\Debugger;
use PLite\Library\Logger;

class Index extends Admin{

    public function index(){
        $uid = (new LoginService())->getLoginInfo('id');

        $accountModel = new AccountModel();
        $list = $accountModel->getAccountList(1);
        if(false === $list){
            Logger::write($accountModel->error());
            $list = [];
        }
        $this->assign('account_list',$list);
        $this->show();
    }

    public function main(){
        $this->show();
    }

    public function top(){
        Debugger::closeTrace();
        $this->show();
    }

    public function left(){
        $this->assign('sidemenu',(new MenuService())->getSideMenu());
        Debugger::closeTrace();
        $this->show();
    }




}